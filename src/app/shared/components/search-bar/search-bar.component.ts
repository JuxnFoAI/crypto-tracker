import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

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

  // 2. Inputs
  readonly placeholder = input.required<string>();
  readonly ariaLabel = input.required<string>();

  // 3. Outputs
  readonly searchChanged = output<string>();

  // 4. Estado
  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  // 5. Ciclo de vida
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        map((value) => value.trim().toLowerCase()),
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => this.searchChanged.emit(term));
  }
}
