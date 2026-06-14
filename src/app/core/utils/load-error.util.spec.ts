import { describe, expect, it } from 'vitest';

import { resolveLoadError } from './load-error.util';

describe('resolveLoadError', () => {
  const rateLimitMessage = 'Rate limit reached';
  const defaultMessage = 'Something went wrong';

  it('returns empty string when state is not error', () => {
    expect(resolveLoadError('loading', false, rateLimitMessage, defaultMessage)).toBe('');
    expect(resolveLoadError('success', true, rateLimitMessage, defaultMessage)).toBe('');
  });

  it('returns rate limit message when API is rate limited', () => {
    expect(resolveLoadError('error', true, rateLimitMessage, defaultMessage)).toBe(
      rateLimitMessage,
    );
  });

  it('returns default message for generic errors', () => {
    expect(resolveLoadError('error', false, rateLimitMessage, defaultMessage)).toBe(
      defaultMessage,
    );
  });
});
