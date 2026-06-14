/**
 * Diccionario de traducciones de la aplicación.
 * Los textos con parámetros se modelan como funciones puras para
 * respetar el orden de palabras de cada idioma.
 */

export type Language = 'es' | 'en';

export interface Translations {
  readonly nav: {
    readonly mainNavigation: string;
    readonly home: string;
    readonly favorites: string;
    readonly favoritesCount: (count: number) => string;
    readonly switchToLight: string;
    readonly switchToDark: string;
    readonly switchLanguage: string;
  };
  readonly home: {
    readonly title: string;
    readonly subtitle: string;
    readonly listLabel: string;
    readonly noResults: string;
    readonly loadError: string;
  };
  readonly favorites: {
    readonly title: string;
    readonly subtitle: string;
    readonly listLabel: string;
    readonly emptyTitle: string;
    readonly emptyText: string;
    readonly exploreCta: string;
    readonly loadError: string;
  };
  readonly detail: {
    readonly back: string;
    readonly rank: (rank: number) => string;
    readonly change24h: string;
    readonly change7d: string;
    readonly historyDays: (days: number) => string;
    readonly about: (name: string) => string;
    readonly readMore: string;
    readonly readLess: string;
    readonly descriptionFallbackNotice: string;
    readonly marketCap: string;
    readonly volume24h: string;
    readonly circulatingSupply: string;
    readonly maxSupply: string;
    readonly unlimited: string;
    readonly ath: string;
    readonly atl: string;
    readonly algorithm: string;
    readonly genesisDate: string;
    readonly links: {
      readonly website: string;
      readonly explorer: string;
      readonly reddit: string;
      readonly github: string;
    };
    readonly priceHistory: string;
    readonly rangeLabel: string;
    readonly historyError: string;
    readonly loadError: string;
    readonly inFavorites: string;
    readonly addToFavorites: string;
    readonly chartLabel: (name: string) => string;
    readonly logoAlt: (name: string) => string;
  };
  readonly card: {
    readonly volume24h: string;
    readonly viewDetail: (name: string) => string;
    readonly logoAlt: (name: string) => string;
    readonly addFavorite: (name: string) => string;
    readonly removeFavorite: (name: string) => string;
  };
  readonly search: {
    readonly placeholder: string;
    readonly ariaLabel: string;
  };
  readonly common: {
    readonly loading: string;
    readonly retry: string;
    readonly rateLimitError: string;
  };
  readonly splash: {
    readonly tagline: string;
  };
}

export const TRANSLATIONS: Readonly<Record<Language, Translations>> = {
  es: {
    nav: {
      mainNavigation: 'Navegación principal',
      home: 'Inicio',
      favorites: 'Favoritos',
      favoritesCount: (count) => `${count} favoritos`,
      switchToLight: 'Cambiar a modo claro',
      switchToDark: 'Cambiar a modo oscuro',
      switchLanguage: 'Switch to English',
    },
    home: {
      title: 'Top 50 Criptomonedas',
      subtitle: 'Precios y datos de mercado en USD, ordenados por capitalización.',
      listLabel: 'Listado de criptomonedas',
      noResults: 'No se encontraron resultados',
      loadError: 'No se pudieron cargar las criptomonedas. Intenta de nuevo.',
    },
    favorites: {
      title: 'Mis Favoritos',
      subtitle: 'Las criptomonedas que marcaste con estrella, siempre a mano.',
      listLabel: 'Listado de criptomonedas favoritas',
      emptyTitle: 'Aún no tienes favoritos',
      emptyText: 'Marca la estrella en cualquier criptomoneda para verla aquí.',
      exploreCta: 'Explorar criptomonedas',
      loadError: 'No se pudieron cargar tus favoritos. Intenta de nuevo.',
    },
    detail: {
      back: 'Volver al inicio',
      rank: (rank) => `#${rank} en ranking`,
      change24h: '24h',
      change7d: '7d',
      historyDays: (days) => `${days}d`,
      about: (name) => `Acerca de ${name}`,
      readMore: 'Leer más',
      readLess: 'Leer menos',
      descriptionFallbackNotice: 'Descripción disponible solo en inglés',
      marketCap: 'Capitalización',
      volume24h: 'Volumen (24h)',
      circulatingSupply: 'Suministro circulante',
      maxSupply: 'Suministro máximo',
      unlimited: 'Sin límite',
      ath: 'Máximo histórico',
      atl: 'Mínimo histórico',
      algorithm: 'Algoritmo',
      genesisDate: 'Fecha de génesis',
      links: {
        website: 'Sitio web',
        explorer: 'Explorador',
        reddit: 'Reddit',
        github: 'GitHub',
      },
      priceHistory: 'Historial de precio',
      rangeLabel: 'Rango del histórico',
      historyError: 'No se pudo cargar el histórico de precios. Intenta con otro rango.',
      loadError: 'No se pudo cargar el detalle de la moneda. Intenta de nuevo.',
      inFavorites: 'En favoritos',
      addToFavorites: 'Añadir a favoritos',
      chartLabel: (name) => `Gráfica del precio de ${name}`,
      logoAlt: (name) => `Logo de ${name}`,
    },
    card: {
      volume24h: 'Vol. 24h',
      viewDetail: (name) => `Ver detalle de ${name}`,
      logoAlt: (name) => `Logo de ${name}`,
      addFavorite: (name) => `Añadir ${name} a favoritos`,
      removeFavorite: (name) => `Quitar ${name} de favoritos`,
    },
    search: {
      placeholder: 'Buscar por nombre o símbolo…',
      ariaLabel: 'Buscar criptomoneda',
    },
    common: {
      loading: 'Cargando…',
      retry: 'Reintentar',
      rateLimitError:
        'Se alcanzó el límite de consultas de la API. Espera unos segundos y reintenta.',
    },
    splash: {
      tagline: 'INTELIGENCIA DE MERCADO EN TIEMPO REAL',
    },
  },
  en: {
    nav: {
      mainNavigation: 'Main navigation',
      home: 'Home',
      favorites: 'Favorites',
      favoritesCount: (count) => `${count} favorites`,
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      switchLanguage: 'Cambiar a español',
    },
    home: {
      title: 'Top 50 Cryptocurrencies',
      subtitle: 'Prices and market data in USD, sorted by market cap.',
      listLabel: 'Cryptocurrency list',
      noResults: 'No results found',
      loadError: 'Could not load cryptocurrencies. Please try again.',
    },
    favorites: {
      title: 'My Favorites',
      subtitle: 'The cryptocurrencies you starred, always at hand.',
      listLabel: 'Favorite cryptocurrencies list',
      emptyTitle: "You don't have favorites yet",
      emptyText: 'Star any cryptocurrency to see it here.',
      exploreCta: 'Explore cryptocurrencies',
      loadError: 'Could not load your favorites. Please try again.',
    },
    detail: {
      back: 'Back to home',
      rank: (rank) => `Rank #${rank}`,
      change24h: '24h',
      change7d: '7d',
      historyDays: (days) => `${days}d`,
      about: (name) => `About ${name}`,
      readMore: 'Read more',
      readLess: 'Read less',
      descriptionFallbackNotice: 'Description only available in English',
      marketCap: 'Market cap',
      volume24h: 'Volume (24h)',
      circulatingSupply: 'Circulating supply',
      maxSupply: 'Max supply',
      unlimited: 'No limit',
      ath: 'All-time high',
      atl: 'All-time low',
      algorithm: 'Algorithm',
      genesisDate: 'Genesis date',
      links: {
        website: 'Website',
        explorer: 'Explorer',
        reddit: 'Reddit',
        github: 'GitHub',
      },
      priceHistory: 'Price history',
      rangeLabel: 'History range',
      historyError: 'Could not load the price history. Try another range.',
      loadError: 'Could not load the coin details. Please try again.',
      inFavorites: 'In favorites',
      addToFavorites: 'Add to favorites',
      chartLabel: (name) => `${name} price chart`,
      logoAlt: (name) => `${name} logo`,
    },
    card: {
      volume24h: '24h Vol.',
      viewDetail: (name) => `View ${name} details`,
      logoAlt: (name) => `${name} logo`,
      addFavorite: (name) => `Add ${name} to favorites`,
      removeFavorite: (name) => `Remove ${name} from favorites`,
    },
    search: {
      placeholder: 'Search by name or symbol…',
      ariaLabel: 'Search cryptocurrency',
    },
    common: {
      loading: 'Loading…',
      retry: 'Retry',
      rateLimitError: 'API request limit reached. Wait a few seconds and try again.',
    },
    splash: {
      tagline: 'REAL-TIME MARKET INTEL',
    },
  },
};
