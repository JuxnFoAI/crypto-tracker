import { Injectable, Signal, signal } from '@angular/core';

const STORAGE_KEY = 'crypto-favorites';

/**
 * Servicio responsable del manejo de favoritos persistidos en localStorage.
 * Expone el estado como Signal de solo lectura para integrarse con `computed()`.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favoritesSignal = signal<string[]>(this.loadFromStorage());

  /** Listado reactivo de ids favoritos. */
  readonly favorites: Signal<string[]> = this.favoritesSignal.asReadonly();

  /**
   * Indica si una moneda está marcada como favorita.
   *
   * @param coinId Identificador de CoinGecko (ej. 'bitcoin')
   */
  isFavorite(coinId: string): boolean {
    return this.favorites().includes(coinId);
  }

  /**
   * Agrega o quita una moneda de favoritos y persiste el cambio en localStorage.
   *
   * @param coinId Identificador de CoinGecko (ej. 'bitcoin')
   */
  toggleFavorite(coinId: string): void {
    const current = this.favoritesSignal();
    const next = current.includes(coinId)
      ? current.filter((id) => id !== coinId)
      : [...current, coinId];

    this.favoritesSignal.set(next);
    this.persist(next);
  }

  private loadFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw !== null ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }

  private persist(ids: readonly string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // localStorage no disponible: el estado dura solo la sesión
    }
  }
}
