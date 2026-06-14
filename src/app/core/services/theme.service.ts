import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'crypto-theme';
const DARK_CLASS = 'dark';

/**
 * Servicio responsable del tema visual (oscuro/claro) de la aplicación.
 * Aplica la clase `dark` en <html> (estrategia `class` de TailwindCSS)
 * y persiste la preferencia del usuario en localStorage.
 * El modo oscuro es el tema por defecto.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly themeSignal = signal<Theme>(this.loadInitialTheme());

  /** Tema actual como Signal de solo lectura. */
  readonly theme: Signal<Theme> = this.themeSignal.asReadonly();

  /** Indica si el tema actual es oscuro. */
  readonly isDark = computed(() => this.themeSignal() === 'dark');

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  /**
   * Alterna entre modo oscuro y claro, aplica el cambio y lo persiste.
   */
  toggleTheme(): void {
    const next: Theme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.themeSignal.set(next);
    this.applyTheme(next);
    this.persist(next);
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
  }

  private loadInitialTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : 'dark';
    } catch {
      return 'dark';
    }
  }

  private persist(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage no disponible: la preferencia dura solo la sesión
    }
  }
}
