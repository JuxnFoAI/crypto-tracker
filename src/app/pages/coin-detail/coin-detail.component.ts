import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, map } from 'rxjs';

import { CoinDetail, CoinHistory } from '../../core/models/coin.model';
import { LoadState } from '../../core/models/load-state.model';
import { CryptoService } from '../../core/services/crypto.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { LanguageService } from '../../core/services/language.service';
import { PriceChartService } from '../../core/services/price-chart.service';
import {
  buildAboutStats,
  buildCoinLinks,
  extractCategories,
  isDescriptionInEnglishFallback,
  resolveLocalizedDescription,
} from '../../core/utils/coin-about.util';
import { VS_CURRENCY, stripHtml, truncateText } from '../../core/utils/coin-format.util';
import { createLoadErrorMessage } from '../../core/utils/load-error.util';
import { loadResource } from '../../core/utils/load-resource.util';
import { createLoadStateHandlers } from '../../core/utils/load-state-handlers.util';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { StarIconComponent } from '../../shared/components/star-icon/star-icon.component';

const HISTORY_RANGES = [7, 14, 30] as const;
type HistoryRange = (typeof HISTORY_RANGES)[number];
const DESCRIPTION_MAX_LENGTH = 300;

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DecimalPipe,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    ProgressBarComponent,
    StarIconComponent,
  ],
  providers: [PriceChartService],
  templateUrl: './coin-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinDetailComponent {
  // 1. Dependencias
  private readonly route = inject(ActivatedRoute);
  private readonly cryptoService = inject(CryptoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly languageService = inject(LanguageService);
  private readonly priceChartService = inject(PriceChartService);
  private readonly destroyRef = inject(DestroyRef);

  // 2. Referencias de template
  private readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  // 3. Estado
  readonly state = signal<LoadState>('loading');
  readonly historyState = signal<LoadState>('loading');
  readonly coin = signal<CoinDetail | null>(null);
  readonly history = signal<CoinHistory | null>(null);
  readonly selectedDays = signal<HistoryRange>(7);
  readonly isDescriptionExpanded = signal<boolean>(false);

  readonly historyRanges = HISTORY_RANGES;

  private readonly coinId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  private historySubscription: Subscription | null = null;

  // 4. Estado computado
  readonly t = this.languageService.translations;

  readonly errorMessage = createLoadErrorMessage(
    this.state,
    this.cryptoService.isRateLimited,
    () => ({
      rateLimitError: this.t().common.rateLimitError,
      loadError: this.t().detail.loadError,
    }),
  );

  readonly currentPrice = computed(
    () => this.coin()?.market_data.current_price[VS_CURRENCY] ?? 0,
  );

  readonly priceChanges = computed(() => {
    const marketData = this.coin()?.market_data;
    const labels = this.t().detail;
    return [
      { label: labels.change24h, value: marketData?.price_change_percentage_24h ?? 0 },
      { label: labels.change7d, value: marketData?.price_change_percentage_7d ?? 0 },
    ];
  });

  readonly isFavorite = computed(() => {
    const detail = this.coin();
    return detail !== null && this.favoritesService.isFavorite(detail.id);
  });

  private readonly plainDescription = computed(() => {
    const detail = this.coin();
    if (detail === null) {
      return '';
    }
    return stripHtml(resolveLocalizedDescription(detail, this.languageService.language()));
  });

  readonly isDescriptionFallback = computed(() => {
    const detail = this.coin();
    if (detail === null) {
      return false;
    }
    return isDescriptionInEnglishFallback(detail, this.languageService.language());
  });

  readonly canExpandDescription = computed(
    () => this.plainDescription().length > DESCRIPTION_MAX_LENGTH,
  );

  readonly displayedDescription = computed(() => {
    const text = this.plainDescription();
    if (this.isDescriptionExpanded() || text.length <= DESCRIPTION_MAX_LENGTH) {
      return text;
    }
    return truncateText(text, DESCRIPTION_MAX_LENGTH);
  });

  readonly categories = computed(() => {
    const detail = this.coin();
    return detail !== null ? extractCategories(detail) : [];
  });

  readonly aboutStats = computed(() => {
    const detail = this.coin();
    if (detail === null) {
      return [];
    }
    return buildAboutStats(detail, this.languageService.language(), this.t().detail);
  });

  readonly coinLinks = computed(() => {
    const detail = this.coin();
    if (detail === null) {
      return [];
    }
    return buildCoinLinks(detail, this.t().detail.links);
  });

  constructor() {
    effect((onCleanup) => {
      const id = this.coinId();
      if (id === '') {
        return;
      }

      this.resetForNewCoin();
      const coinSub = this.loadCoin(id);
      this.loadHistory(id, this.selectedDays());

      onCleanup(() => {
        coinSub.unsubscribe();
        this.historySubscription?.unsubscribe();
      });
    });

    effect(() => {
      const canvasRef = this.chartCanvas();
      const history = this.history();
      const language = this.languageService.language();
      if (canvasRef !== undefined && history !== null) {
        this.priceChartService.render(canvasRef.nativeElement, history, language);
      }
    });

    this.destroyRef.onDestroy(() => this.priceChartService.destroy());
  }

  // 5. Métodos públicos
  selectDays(days: HistoryRange): void {
    if (days === this.selectedDays()) {
      return;
    }
    this.selectedDays.set(days);
    this.loadHistory(this.coinId(), days);
  }

  toggleFavorite(): void {
    this.favoritesService.toggleFavorite(this.coinId());
  }

  toggleDescription(): void {
    this.isDescriptionExpanded.update((expanded) => !expanded);
  }

  retry(): void {
    const id = this.coinId();
    this.loadCoin(id);
    this.loadHistory(id, this.selectedDays());
  }

  // 6. Métodos privados
  private resetForNewCoin(): void {
    this.isDescriptionExpanded.set(false);
    this.coin.set(null);
    this.history.set(null);
    this.priceChartService.destroy();
  }

  private loadCoin(id: string): Subscription {
    return loadResource(
      this.cryptoService.getCoinById(id),
      createLoadStateHandlers(this.state, this.coin),
      null,
    );
  }

  private loadHistory(id: string, days: HistoryRange): void {
    this.historySubscription?.unsubscribe();
    this.historySubscription = loadResource(
      this.cryptoService.getCoinHistory(id, days),
      {
        setLoading: () => {
          this.history.set(null);
          this.historyState.set('loading');
        },
        setSuccess: (history) => {
          this.history.set(history);
          this.historyState.set('success');
        },
        setError: () => {
          this.history.set(null);
          this.historyState.set('error');
        },
        isLoading: () => this.historyState() === 'loading',
      },
      this.historySubscription,
    );
  }
}
