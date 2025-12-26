/**
 * Tests for versionHistory method
 */

import { test, expect, describe } from 'bun:test';
import { versionHistory } from '../src/index.ts';

describe('Version History method', () => {
  test('should fetch version history for an app', async () => {
    const result = await versionHistory({ id: '553834731' });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    const version = result[0]!;
    expect(typeof version.versionDisplay).toBe('string');
    expect(version.versionDisplay).toMatch(/^\d+\.\d+/);
    expect(typeof version.releaseDate).toBe('string');
    expect(version.releaseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    if (version.releaseNotes) {
      expect(typeof version.releaseNotes).toBe('string');
    }
  }, 30000);

  test('should fetch version history for different country', async () => {
    const result = await versionHistory({ id: '1476359069', country: 'jp' });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    const version = result[0]!;
    expect(typeof version.versionDisplay).toBe('string');
  }, 30000);

  test('should throw error when id is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(versionHistory({})).rejects.toThrow('id is required');
  });
});
