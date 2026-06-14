import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import { LanguageService } from '../../../core/services/language.service';

const SPLASH_DURATION_MS = 3000;
const EXIT_ANIMATION_MS = 400;

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent implements OnInit {
  // 1. Dependencias
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);

  // 2. Outputs
  /** Se emite cuando la splash terminó su animación de salida y se destruyó. */
  readonly hidden = output<void>();

  // 3. Estado
  readonly isVisible = signal(true);
  readonly isLeaving = signal(false);

  // 4. Estado computado
  readonly t = this.languageService.translations;

  // 5. Ciclo de vida
  ngOnInit(): void {
    timer(SPLASH_DURATION_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.dismiss());
  }

  // 6. Métodos privados
  /**
   * Inicia la animación de salida y, al terminar, destruye el elemento
   * del DOM (@if) notificando al padre vía `hidden`.
   */
  private dismiss(): void {
    this.isLeaving.set(true);

    timer(EXIT_ANIMATION_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isVisible.set(false);
        this.hidden.emit();
      });
  }
}
