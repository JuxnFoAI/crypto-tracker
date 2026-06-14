import { Language, Translations } from '../i18n/translations';
import { CoinDetail } from '../models/coin.model';
import {
  FULL_DATE_FORMATTERS,
  SUPPLY_FORMATTERS,
  USD_COMPACT_FORMATTER,
  USD_FORMATTER,
  VS_CURRENCY,
  firstValidUrl,
} from './coin-format.util';

const MAX_CATEGORIES = 4;

/** Dato clave de la ficha "Acerca de" listo para renderizar. */
export interface AboutStat {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly progress?: number;
}

/** Enlace externo oficial de la moneda. */
export interface CoinExternalLink {
  readonly label: string;
  readonly url: string;
}

/** Categorías válidas de la moneda (máx. 4). */
export function extractCategories(detail: CoinDetail): readonly string[] {
  return detail.categories
    .filter((category): category is string => typeof category === 'string' && category !== '')
    .slice(0, MAX_CATEGORIES);
}

/** Descripción localizada con fallback a inglés. */
export function resolveLocalizedDescription(detail: CoinDetail, language: Language): string {
  return detail.description[language] || detail.description.en;
}

/** Indica si la descripción usa inglés como fallback. */
export function isDescriptionInEnglishFallback(detail: CoinDetail, language: Language): boolean {
  return language !== 'en' && detail.description[language] === '' && detail.description.en !== '';
}

/** Construye los datos clave de la ficha "Acerca de". */
export function buildAboutStats(
  detail: CoinDetail,
  language: Language,
  labels: Translations['detail'],
): readonly AboutStat[] {
  const market = detail.market_data;
  const supplyFormatter = SUPPLY_FORMATTERS[language];
  const dateFormatter = FULL_DATE_FORMATTERS[language];
  const symbol = detail.symbol.toUpperCase();

  const stats: AboutStat[] = [
    {
      label: labels.marketCap,
      value: USD_COMPACT_FORMATTER.format(market.market_cap[VS_CURRENCY] ?? 0),
    },
    {
      label: labels.volume24h,
      value: USD_COMPACT_FORMATTER.format(market.total_volume[VS_CURRENCY] ?? 0),
    },
  ];

  if (market.circulating_supply !== null) {
    const hasMaxSupply = market.max_supply !== null && market.max_supply > 0;
    stats.push({
      label: labels.circulatingSupply,
      value: `${supplyFormatter.format(market.circulating_supply)} ${symbol}`,
      progress: hasMaxSupply
        ? Math.min(100, (market.circulating_supply / (market.max_supply ?? 1)) * 100)
        : undefined,
    });
  }

  stats.push({
    label: labels.maxSupply,
    value:
      market.max_supply !== null
        ? `${supplyFormatter.format(market.max_supply)} ${symbol}`
        : labels.unlimited,
  });

  const ath = market.ath[VS_CURRENCY];
  if (ath !== undefined) {
    const athChange = market.ath_change_percentage[VS_CURRENCY];
    const athDate = market.ath_date[VS_CURRENCY];
    const hintParts: string[] = [];
    if (athChange !== undefined) {
      hintParts.push(`${athChange.toFixed(1)}%`);
    }
    if (athDate !== undefined) {
      hintParts.push(dateFormatter.format(new Date(athDate)));
    }
    stats.push({ label: labels.ath, value: USD_FORMATTER.format(ath), hint: hintParts.join(' · ') });
  }

  const atl = market.atl[VS_CURRENCY];
  if (atl !== undefined) {
    const atlDate = market.atl_date[VS_CURRENCY];
    stats.push({
      label: labels.atl,
      value: USD_FORMATTER.format(atl),
      hint: atlDate !== undefined ? dateFormatter.format(new Date(atlDate)) : undefined,
    });
  }

  if (detail.hashing_algorithm !== null) {
    stats.push({ label: labels.algorithm, value: detail.hashing_algorithm });
  }

  if (detail.genesis_date !== null) {
    stats.push({
      label: labels.genesisDate,
      value: dateFormatter.format(new Date(detail.genesis_date)),
    });
  }

  return stats;
}

/** Construye los enlaces externos disponibles para la moneda. */
export function buildCoinLinks(
  detail: CoinDetail,
  labels: Translations['detail']['links'],
): readonly CoinExternalLink[] {
  const candidates: CoinExternalLink[] = [
    { label: labels.website, url: firstValidUrl(detail.links.homepage) },
    { label: labels.explorer, url: firstValidUrl(detail.links.blockchain_site) },
    { label: labels.reddit, url: detail.links.subreddit_url ?? '' },
    { label: labels.github, url: detail.links.repos_url.github[0] ?? '' },
  ];
  return candidates.filter((link) => link.url !== '');
}
