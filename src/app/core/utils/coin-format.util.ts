import { Language } from '../i18n/translations';

export const VS_CURRENCY = 'usd';

export const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const USD_COMPACT_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

export const CHART_DATE_FORMATTERS: Readonly<Record<Language, Intl.DateTimeFormat>> = {
  es: new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }),
  en: new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }),
};

export const FULL_DATE_FORMATTERS: Readonly<Record<Language, Intl.DateTimeFormat>> = {
  es: new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }),
};

export const SUPPLY_FORMATTERS: Readonly<Record<Language, Intl.NumberFormat>> = {
  es: new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }),
};

/** Convierte HTML de CoinGecko a texto plano legible. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\r?\n{2,}/g, '\n\n')
    .trim();
}

/** Recorta texto largo con elipsis si supera el límite. */
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/** Devuelve el primer URL no vacío de un arreglo de la API. */
export function firstValidUrl(urls: readonly string[]): string {
  return urls.find((url) => url !== '') ?? '';
}
