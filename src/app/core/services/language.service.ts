import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';

import { Language, TRANSLATIONS, Translations } from '../i18n/translations';

const STORAGE_KEY = 'crypto-language';
const FALLBACK_LANGUAGE: Language = 'en';

/**
 * Servicio responsable del idioma de la aplicación.
 * Detecta automáticamente el idioma del navegador en la primera visita,
 * persiste la preferencia del usuario en localStorage y sincroniza el
 * atributo `lang` de <html> por accesibilidad/SEO.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  private readonly languageSignal = signal<Language>(this.resolveInitialLanguage());

  /** Idioma actual como Signal de solo lectura. */
  readonly language: Signal<Language> = this.languageSignal.asReadonly();

  /** Diccionario de textos del idioma actual; reacciona al cambio de idioma. */
  readonly translations: Signal<Translations> = computed(
    () => TRANSLATIONS[this.languageSignal()],
  );

  constructor() {
    this.applyLanguage(this.languageSignal());
  }

  /**
   * Alterna entre español e inglés, aplica el cambio y lo persiste.
   */
  toggleLanguage(): void {
    const next: Language = this.languageSignal() === 'es' ? 'en' : 'es';
    this.languageSignal.set(next);
    this.applyLanguage(next);
    this.persist(next);
  }

  /**
   * Preferencia guardada > idioma del navegador > inglés por defecto.
   */
  private resolveInitialLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
    } catch {
      // localStorage no disponible: continuamos con la detección
    }
    return this.detectBrowserLanguage();
  }

  private detectBrowserLanguage(): Language {
    const browserLanguage = navigator.language?.toLowerCase() ?? '';
    return browserLanguage.startsWith('es') ? 'es' : FALLBACK_LANGUAGE;
  }

  private applyLanguage(language: Language): void {
    this.document.documentElement.lang = language;
  }

  private persist(language: Language): void {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // localStorage no disponible: la preferencia dura solo la sesión
    }
  }
}
