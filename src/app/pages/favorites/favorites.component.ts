import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Coin } from '../../core/models/coin.model';
import { LoadState } from '../../core/models/load-state.model';
import { CryptoService } from '../../core/services/crypto.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { LanguageService } from '../../core/services/language.service';
import { createLoadErrorMessage } from '../../core/utils/load-error.util';
import { createResourceLoader } from '../../core/utils/load-resource.util';
import { createLoadStateHandlers } from '../../core/utils/load-state-handlers.util';
import { CoinGridComponent } from '../../shared/components/coin-grid/coin-grid.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StarIconComponent } from '../../shared/components/star-icon/star-icon.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    RouterLink,
    CoinGridComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    StarIconComponent,
  ],
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit {
  // 1. Dependencias
  private readonly cryptoService = inject(CryptoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly resourceLoader = createResourceLoader(this.destroyRef);

  // 2. Estado
  readonly state = signal<LoadState>('loading');
  readonly allCoins = signal<Coin[]>([]);

  private readonly loadHandlers = createLoadStateHandlers(this.state, this.allCoins);

  // 3. Estado computado
  readonly t = this.languageService.translations;

  readonly errorMessage = createLoadErrorMessage(
    this.state,
    this.cryptoService.isRateLimited,
    () => ({
      rateLimitError: this.t().common.rateLimitError,
      loadError: this.t().favorites.loadError,
    }),
  );

  readonly favoriteCoins = computed(() => {
    const favoriteIds = new Set(this.favoritesService.favorites());
    return this.allCoins().filter((coin) => favoriteIds.has(coin.id));
  });

  readonly isFavorite = (coinId: string): boolean => this.favoritesService.isFavorite(coinId);

  // 4. Ciclo de vida
  ngOnInit(): void {
    this.loadFavoriteCoins();
  }

  // 5. Métodos públicos
  onFavoriteToggled(coinId: string): void {
    this.favoritesService.toggleFavorite(coinId);
  }

  retry(): void {
    this.loadFavoriteCoins();
  }

  // 6. Métodos privados
  private loadFavoriteCoins(): void {
    const ids = this.favoritesService.favorites();

    if (ids.length === 0) {
      this.allCoins.set([]);
      this.state.set('success');
      return;
    }

    this.resourceLoader.load(this.cryptoService.getCoinsByIds(ids), this.loadHandlers);
  }
}
