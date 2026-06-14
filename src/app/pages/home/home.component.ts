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

import { resolveLoadError } from '../../core/utils/load-error.util';

import { createResourceLoader } from '../../core/utils/load-resource.util';

import { CoinCardComponent } from '../../shared/components/coin-card/coin-card.component';

import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';



@Component({

  selector: 'app-home',

  standalone: true,

  imports: [CoinCardComponent, ErrorStateComponent, LoadingSpinnerComponent, SearchBarComponent],

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



  // 3. Estado computado

  readonly t = this.languageService.translations;



  readonly errorMessage = computed(() =>

    resolveLoadError(

      this.state(),

      this.cryptoService.isRateLimited(),

      this.t().common.rateLimitError,

      this.t().home.loadError,

    ),

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



  // 4. Ciclo de vida

  ngOnInit(): void {

    this.loadCoins();

  }



  // 5. Métodos públicos

  onSearchChanged(term: string): void {

    this.searchTerm.set(term);

  }



  isFavorite(coinId: string): boolean {

    return this.favoritesService.isFavorite(coinId);

  }



  onFavoriteToggled(coinId: string): void {

    this.favoritesService.toggleFavorite(coinId);

  }



  retry(): void {

    this.loadCoins();

  }



  // 6. Métodos privados

  private loadCoins(): void {

    this.resourceLoader.load(this.cryptoService.getTopCoins(), {

      setLoading: () => this.state.set('loading'),

      setSuccess: (coins) => {

        this.coins.set(coins);

        this.state.set('success');

      },

      setError: () => this.state.set('error'),

      isLoading: () => this.state() === 'loading',

    });

  }

}


