import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Translations } from '../../../core/i18n/translations';
import { Coin } from '../../../core/models/coin.model';
import { CoinCardComponent } from '../coin-card/coin-card.component';

@Component({
  selector: 'app-coin-grid',
  standalone: true,
  imports: [CoinCardComponent],
  templateUrl: './coin-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinGridComponent {
  readonly coins = input.required<Coin[]>();
  readonly translations = input.required<Translations>();
  readonly listLabel = input.required<string>();
  readonly isFavorite = input.required<(coinId: string) => boolean>();
  readonly favoriteToggled = output<string>();
}
