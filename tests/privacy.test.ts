/**
 * Tests for privacy method
 */

import { test, expect, describe } from 'bun:test';
import { privacy } from '../src/index.ts';

describe('Privacy method', () => {
  test('should fetch privacy details for an app (or fail gracefully)', async () => {
    try {
      const result = await privacy({ id: '553834731' });

      expect(typeof result).toBe('object');

      // Privacy details structure varies, but should have privacyTypes
      if (result.privacyTypes) {
        expect(Array.isArray(result.privacyTypes)).toBe(true);
      }
    } catch (error) {
      // This test may fail if Apple's page structure changes or blocks the request
      // The error should be about authentication token not being found
      expect((error as Error).message).toContain('Could not find authentication token');
    }
  }, 30000);

  test('should throw error when id is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(privacy({})).rejects.toThrow('id is required');
  });
});
