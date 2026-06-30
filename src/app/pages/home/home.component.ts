import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

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
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CoinGridComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    SearchBarComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  // 1. Dependencias
  private readonly cryptoService = inject(CryptoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly resourceLoader = createResourceLoader(this.destroyRef);

  // 2. Estado
  readonly state = signal<LoadState>('loading');
  readonly coins = signal<Coin[]>([]);
  readonly searchTerm = signal<string>('');

  private readonly loadHandlers = createLoadStateHandlers(this.state, this.coins);

  // 3. Estado computado
  readonly t = this.languageService.translations;

  readonly errorMessage = createLoadErrorMessage(
    this.state,
    this.cryptoService.isRateLimited,
    () => ({
      rateLimitError: this.t().common.rateLimitError,
      loadError: this.t().home.loadError,
    }),
  );

  readonly filteredCoins = computed(() => {
    const term = this.searchTerm();
    if (term === '') {
      return this.coins();
    }
    return this.coins().filter(
      (coin) => coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term),
    );
  });

  readonly isFavorite = (coinId: string): boolean => this.favoritesService.isFavorite(coinId);

  // 4. Ciclo de vida
  ngOnInit(): void {
    this.loadCoins();
  }

  // 5. Métodos públicos
  onSearchChanged(term: string): void {
    this.searchTerm.set(term);
  }

  onFavoriteToggled(coinId: string): void {
    this.favoritesService.toggleFavorite(coinId);
  }

  retry(): void {
    this.loadCoins();
  }

  // 6. Métodos privados
  private loadCoins(): void {
    this.resourceLoader.load(this.cryptoService.getTopCoins(), this.loadHandlers);
  }
}
