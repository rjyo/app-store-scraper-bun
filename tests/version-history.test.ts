/**
 * Tests for versionHistory method
 */

import { test, expect, describe } from 'bun:test';
import { versionHistory } from '../src/index.ts';

describe('Version History method', () => {
  test('should fetch version history for an app (or fail gracefully)', async () => {
    try {
      const result = await versionHistory({ id: '553834731' });

      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        const version = result[0]!;
        expect(typeof version.versionDisplay).toBe('string');
        expect(typeof version.releaseDate).toBe('string');
        // releaseNotes is optional
      }
    } catch (error) {
      // This test may fail if Apple's page structure changes or blocks the request
      // The error should be about authentication token not being found
      expect((error as Error).message).toContain('Could not find authentication token');
    }
  }, 30000);

  test('should throw error when id is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(versionHistory({})).rejects.toThrow('id is required');
  });
});
