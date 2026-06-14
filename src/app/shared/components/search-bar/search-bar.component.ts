import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { LanguageService } from '../../../core/services/language.service';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit {
  // 1. Dependencias
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);

  // 2. Outputs
  readonly searchChanged = output<string>();

  // 3. Estado
  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  // 4. Estado computado
  readonly t = this.languageService.translations;

  // 5. Ciclo de vida
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        // Normalizar antes de distinctUntilChanged: "BTC " y "btc" son la misma búsqueda
        map((value) => value.trim().toLowerCase()),
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => this.searchChanged.emit(term));
  }
}
