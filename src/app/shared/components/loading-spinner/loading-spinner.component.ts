import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  // 1. Dependencias
  private readonly languageService = inject(LanguageService);

  // 2. Estado computado
  readonly t = this.languageService.translations;
}
