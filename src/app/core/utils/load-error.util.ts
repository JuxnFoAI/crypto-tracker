import { Signal, computed } from '@angular/core';

import { LoadState } from '../models/load-state.model';

interface LoadErrorMessages {
  readonly rateLimitError: string;
  readonly loadError: string;
}

/**
 * Resuelve el mensaje de error a mostrar según el estado de carga
 * y si la API respondió con rate limit (HTTP 429).
 */
export function resolveLoadError(
  state: LoadState,
  isRateLimited: boolean,
  rateLimitMessage: string,
  defaultMessage: string,
): string {
  if (state !== 'error') {
    return '';
  }
  return isRateLimited ? rateLimitMessage : defaultMessage;
}

/**
 * Signal derivado con el mensaje de error contextual para páginas que cargan datos de la API.
 */
export function createLoadErrorMessage(
  state: Signal<LoadState>,
  isRateLimited: Signal<boolean>,
  getMessages: () => LoadErrorMessages,
): Signal<string> {
  return computed(() => {
    const { rateLimitError, loadError } = getMessages();
    return resolveLoadError(state(), isRateLimited(), rateLimitError, loadError);
  });
}
