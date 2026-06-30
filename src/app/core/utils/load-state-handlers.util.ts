import { WritableSignal } from '@angular/core';

import { LoadState } from '../models/load-state.model';
import { LoadResourceHandlers } from './load-resource.util';

/**
 * Crea el conjunto estándar de handlers para cargas HTTP con estado loading/success/error.
 */
export function createLoadStateHandlers<T>(
  state: WritableSignal<LoadState>,
  data: WritableSignal<T>,
): LoadResourceHandlers<T> {
  return {
    setLoading: (): void => state.set('loading'),
    setSuccess: (value: T): void => {
      data.set(value);
      state.set('success');
    },
    setError: (): void => state.set('error'),
    isLoading: (): boolean => state() === 'loading',
  };
}
