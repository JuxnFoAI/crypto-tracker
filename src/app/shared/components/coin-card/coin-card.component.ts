import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Coin } from '../../../core/models/coin.model';
import { Translations } from '../../../core/i18n/translations';
import { StarIconComponent } from '../star-icon/star-icon.component';

@Component({
  selector: 'app-coin-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe, StarIconComponent],
  templateUrl: './coin-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinCardComponent {
  readonly coin = input.required<Coin>();
  readonly isFavorite = input<boolean>(false);
  readonly translations = input.required<Translations>();

  readonly favoriteToggled = output<string>();

  readonly change24h = computed(() => this.coin().price_change_percentage_24h ?? 0);
  readonly isPositiveChange = computed(() => this.change24h() >= 0);

  toggleFavorite(): void {
    this.favoriteToggled.emit(this.coin().id);
  }
}
