import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FavoritesService } from '../../../core/services/favorites.service';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // 1. Dependencias
  private readonly favoritesService = inject(FavoritesService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  // 2. Estado computado
  readonly favoritesCount = computed(() => this.favoritesService.favorites().length);

  readonly isDark = this.themeService.isDark;

  readonly language = this.languageService.language;

  readonly t = this.languageService.translations;

  // 3. Métodos públicos
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
