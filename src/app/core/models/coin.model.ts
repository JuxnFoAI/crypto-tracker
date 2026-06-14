/**
 * Modelos de datos para la API de CoinGecko.
 * Las propiedades en snake_case reflejan la respuesta cruda de la API.
 */

/** Moneda del listado de mercados. Endpoint: GET /coins/markets */
export interface Coin {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly image: string;
  readonly current_price: number;
  readonly market_cap: number;
  readonly market_cap_rank: number;
  readonly price_change_percentage_24h: number | null;
  readonly total_volume: number;
}

/** Descripción localizada (CoinGecko devuelve un objeto por idioma). */
export interface CoinDescription {
  readonly en: string;
  readonly es: string;
}

/** Enlaces oficiales y de comunidad de una moneda. */
export interface CoinLinks {
  readonly homepage: readonly string[];
  readonly blockchain_site: readonly string[];
  readonly subreddit_url: string | null;
  readonly repos_url: {
    readonly github: readonly string[];
  };
}

/** Imágenes de la moneda en distintos tamaños. */
export interface CoinImage {
  readonly thumb: string;
  readonly small: string;
  readonly large: string;
}

/** Datos de mercado indexados por divisa (ej. current_price['usd']). */
export interface CoinMarketData {
  readonly current_price: Readonly<Record<string, number>>;
  readonly market_cap: Readonly<Record<string, number>>;
  readonly total_volume: Readonly<Record<string, number>>;
  readonly price_change_percentage_24h: number | null;
  readonly price_change_percentage_7d: number | null;
  readonly circulating_supply: number | null;
  readonly max_supply: number | null;
  readonly ath: Readonly<Record<string, number>>;
  readonly ath_change_percentage: Readonly<Record<string, number>>;
  readonly ath_date: Readonly<Record<string, string>>;
  readonly atl: Readonly<Record<string, number>>;
  readonly atl_date: Readonly<Record<string, string>>;
}

/** Detalle completo de una moneda. Endpoint: GET /coins/{id} */
export interface CoinDetail {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly market_cap_rank: number | null;
  readonly categories: ReadonlyArray<string | null>;
  readonly genesis_date: string | null;
  readonly hashing_algorithm: string | null;
  readonly description: CoinDescription;
  readonly links: CoinLinks;
  readonly image: CoinImage;
  readonly market_data: CoinMarketData;
}

/** Par [timestamp en ms, valor] de las series históricas de CoinGecko. */
export type HistoryPoint = readonly [timestamp: number, value: number];

/** Histórico de precios. Endpoint: GET /coins/{id}/market_chart */
export interface CoinHistory {
  readonly prices: readonly HistoryPoint[];
}
