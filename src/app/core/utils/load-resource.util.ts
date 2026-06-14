import { DestroyRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

interface LoadResourceHandlers<T> {
  readonly setLoading: () => void;
  readonly setSuccess: (value: T) => void;
  readonly setError: () => void;
  readonly isLoading: () => boolean;
}

export interface ResourceLoader {
  load<T>(source$: Observable<T>, handlers: LoadResourceHandlers<T>): void;
}

/**
 * Patrón estándar de suscripción para recursos HTTP que devuelven EMPTY
 * ante error: emite el valor en `next` o marca error en `complete` si no hubo emisión.
 *
 * Cancela la suscripción anterior automáticamente en cada nueva carga.
 */
export function createResourceLoader(destroyRef?: DestroyRef): ResourceLoader {
  let subscription: Subscription | null = null;

  destroyRef?.onDestroy(() => subscription?.unsubscribe());

  return {
    load<T>(source$: Observable<T>, handlers: LoadResourceHandlers<T>): void {
      subscription?.unsubscribe();
      handlers.setLoading();

      subscription = source$.subscribe({
        next: (value) => handlers.setSuccess(value),
        complete: () => {
          if (handlers.isLoading()) {
            handlers.setError();
          }
        },
      });
    },
  };
}

/**
 * Variante con Subscription retornada para cancelación manual (ej. effects con onCleanup).
 */
export function loadResource<T>(
  source$: Observable<T>,
  handlers: LoadResourceHandlers<T>,
  previous?: Subscription | null,
): Subscription {
  previous?.unsubscribe();
  handlers.setLoading();

  return source$.subscribe({
    next: (value) => handlers.setSuccess(value),
    complete: () => {
      if (handlers.isLoading()) {
        handlers.setError();
      }
    },
  });
}
