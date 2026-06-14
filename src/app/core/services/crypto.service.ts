import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, of, shareReplay, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Coin, CoinDetail, CoinHistory } from '../models/coin.model';
import { VS_CURRENCY } from '../utils/coin-format.util';
const MARKET_ORDER = 'market_cap_desc';
const FIRST_PAGE = 1;

/**
 * TTL de la caché en memoria. La API gratuita de CoinGecko limita a
 * ~5-15 peticiones/minuto: reutilizar respuestas recientes evita agotar
 * la cuota al navegar entre páginas o cambiar rangos del histórico.
 */
const CACHE_TTL_MS = 60_000;
const HTTP_TOO_MANY_REQUESTS = 429;

interface CacheEntry {
  readonly expiresAt: number;
  readonly data$: Observable<unknown>;
}

/**
 * Servicio responsable de las llamadas a la API de CoinGecko.
 * Cachea las respuestas durante un TTL corto y comparte las peticiones
 * en vuelo (shareReplay) para minimizar el consumo del rate limit.
 */
@Injectable({ providedIn: 'root' })
export class CryptoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl: string = environment.apiBaseUrl;
  private readonly cache = new Map<string, CacheEntry>();

  private readonly rateLimitedSignal = signal<boolean>(false);

  /** Indica si la última petición fallida fue por el límite de la API (HTTP 429). */
  readonly isRateLimited: Signal<boolean> = this.rateLimitedSignal.asReadonly();

  /**
   * Obtiene el listado de las principales monedas ordenadas por capitalización
   * de mercado.
   * Endpoint: GET /coins/markets
   */
  /**
   * Obtiene datos de mercado para un conjunto de monedas por id.
   * Endpoint: GET /coins/markets?ids=...
   */
  getCoinsByIds(ids: readonly string[]): Observable<Coin[]> {
    if (ids.length === 0) {
      return of([]);
    }

    const sortedIds = [...ids].sort().join(',');
    const params = new HttpParams()
      .set('vs_currency', VS_CURRENCY)
      .set('ids', sortedIds)
      .set('order', MARKET_ORDER)
      .set('sparkline', false);

    return this.getOrFetch(`coins-by-ids:${sortedIds}`, 'getCoinsByIds', () =>
      this.http.get<Coin[]>(`${this.baseUrl}/coins/markets`, { params }),
    );
  }

  getTopCoins(): Observable<Coin[]> {
    const params = new HttpParams()
      .set('vs_currency', VS_CURRENCY)
      .set('order', MARKET_ORDER)
      .set('per_page', environment.coinsPerPage)
      .set('page', FIRST_PAGE);

    return this.getOrFetch('top-coins', 'getTopCoins', () =>
      this.http.get<Coin[]>(`${this.baseUrl}/coins/markets`, { params }),
    );
  }

  /**
   * Obtiene el detalle completo de una moneda por su identificador.
   * `localization=true` para recibir la descripción en todos los idiomas
   * soportados (la UI elige entre 'en' y 'es' según el idioma activo).
   * Endpoint: GET /coins/{id}
   *
   * @param id Identificador de CoinGecko (ej. 'bitcoin')
   */
  getCoinById(id: string): Observable<CoinDetail> {
    const params = new HttpParams()
      .set('localization', true)
      .set('tickers', false)
      .set('community_data', false)
      .set('developer_data', false);

    return this.getOrFetch(`coin:${id}`, 'getCoinById', () =>
      this.http.get<CoinDetail>(`${this.baseUrl}/coins/${id}`, { params }),
    );
  }

  /**
   * Obtiene el histórico de precios, capitalización y volumen de una moneda.
   * Endpoint: GET /coins/{id}/market_chart
   *
   * @param id   Identificador de CoinGecko (ej. 'bitcoin')
   * @param days Rango del histórico en días (ej. 7, 30, 365)
   */
  getCoinHistory(id: string, days: number): Observable<CoinHistory> {
    const params = new HttpParams().set('vs_currency', VS_CURRENCY).set('days', days);

    return this.getOrFetch(`history:${id}:${days}`, 'getCoinHistory', () =>
      this.http.get<CoinHistory>(`${this.baseUrl}/coins/${id}/market_chart`, { params }),
    );
  }

  /**
   * Devuelve la respuesta cacheada si sigue vigente; si no, lanza la petición
   * y la cachea. `shareReplay` garantiza que los suscriptores concurrentes
   * (ej. Home y Favoritos a la vez) compartan una única llamada HTTP.
   */
  private getOrFetch<T>(
    cacheKey: string,
    operation: string,
    request: () => Observable<T>,
  ): Observable<T> {
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined && cached.expiresAt > Date.now()) {
      return cached.data$ as Observable<T>;
    }

    const data$ = request().pipe(
      tap(() => this.rateLimitedSignal.set(false)),
      catchError((error: HttpErrorResponse) => this.handleError(operation, cacheKey, error)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data$ });
    return data$;
  }

  /**
   * Registra el error, invalida la entrada de caché (para que el reintento
   * vuelva a llamar a la API) y devuelve EMPTY para que el stream complete
   * sin emitir, evitando romper a los suscriptores.
   */
  private handleError(
    _operation: string,
    cacheKey: string,
    error: HttpErrorResponse,
  ): Observable<never> {
    this.cache.delete(cacheKey);
    this.rateLimitedSignal.set(error.status === HTTP_TOO_MANY_REQUESTS);
    return EMPTY;
  }
}
