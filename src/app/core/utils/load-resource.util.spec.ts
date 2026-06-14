import { describe, expect, it } from 'vitest';
import { EMPTY, Observable, of } from 'rxjs';

import { createResourceLoader, loadResource } from './load-resource.util';

describe('load-resource.util', () => {
  it('sets success when the source emits a value', () => {
    const states: string[] = [];
    let loading = false;
    const loader = createResourceLoader();

    loader.load(of(['bitcoin']), {
      setLoading: () => {
        loading = true;
        states.push('loading');
      },
      setSuccess: (value) => {
        loading = false;
        states.push(`success:${value.join(',')}`);
      },
      setError: () => states.push('error'),
      isLoading: () => loading,
    });

    expect(states).toEqual(['loading', 'success:bitcoin']);
  });

  it('sets error when the source completes without emitting', () => {
    const states: string[] = [];
    let loading = false;

    loadResource(EMPTY, {
      setLoading: () => {
        loading = true;
        states.push('loading');
      },
      setSuccess: () => {
        loading = false;
        states.push('success');
      },
      setError: () => states.push('error'),
      isLoading: () => loading,
    });

    expect(states).toEqual(['loading', 'error']);
  });

  it('unsubscribes from a slow request when a new load starts', () => {
    let firstTeardownCalled = false;
    const results: string[] = [];
    const loader = createResourceLoader();

    const slowSource = new Observable<string>((subscriber) => {
      const timeout = setTimeout(() => subscriber.next('slow'), 50);
      return () => {
        clearTimeout(timeout);
        firstTeardownCalled = true;
      };
    });

    const handlers = {
      setLoading: () => undefined,
      setSuccess: (value: string) => results.push(value),
      setError: () => undefined,
      isLoading: () => false,
    };

    loader.load(slowSource, handlers);
    loader.load(of('fast'), handlers);

    expect(firstTeardownCalled).toBe(true);
    expect(results).toEqual(['fast']);
  });
});
