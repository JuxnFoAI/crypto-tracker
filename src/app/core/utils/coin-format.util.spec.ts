import { describe, expect, it } from 'vitest';

import { firstValidUrl, stripHtml, truncateText } from './coin-format.util';

describe('coin-format.util', () => {
  describe('stripHtml', () => {
    it('removes HTML tags and normalizes line breaks', () => {
      const input = '<p>Hello</p>\n\n\n<p>World</p>';
      expect(stripHtml(input)).toBe('Hello\n\nWorld');
    });
  });

  describe('truncateText', () => {
    it('returns original text when under the limit', () => {
      expect(truncateText('short', 10)).toBe('short');
    });

    it('truncates with ellipsis when over the limit', () => {
      expect(truncateText('abcdefghij', 5)).toBe('abcde…');
    });
  });

  describe('firstValidUrl', () => {
    it('returns the first non-empty URL', () => {
      expect(firstValidUrl(['', 'https://example.com', 'https://other.com'])).toBe(
        'https://example.com',
      );
    });

    it('returns empty string when no valid URL exists', () => {
      expect(firstValidUrl(['', ''])).toBe('');
    });
  });
});
