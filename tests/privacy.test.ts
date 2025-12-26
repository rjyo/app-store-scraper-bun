/**
 * Tests for privacy method
 */

import { test, expect, describe } from 'bun:test';
import { privacy } from '../src/index.ts';

describe('Privacy method', () => {
  test('should fetch privacy details for an app', async () => {
    const result = await privacy({ id: '553834731' });

    expect(typeof result).toBe('object');
    expect(Array.isArray(result.privacyTypes)).toBe(true);
    expect(result.privacyTypes.length).toBeGreaterThan(0);

    const privacyType = result.privacyTypes[0]!;
    expect(typeof privacyType.privacyType).toBe('string');
    expect(privacyType.privacyType).toContain('Data');
    expect(typeof privacyType.description).toBe('string');
    expect(Array.isArray(privacyType.dataCategories)).toBe(true);
    expect(Array.isArray(privacyType.purposes)).toBe(true);
  }, 30000);

  test('should parse data categories correctly', async () => {
    const result = await privacy({ id: '553834731' });

    // Find "Data Used to Track You" which has simple data categories
    const trackingType = result.privacyTypes.find((t) => t.privacyType.includes('Track'));

    if (trackingType) {
      expect(trackingType.dataCategories.length).toBeGreaterThan(0);
      expect(trackingType.dataCategories.every((c) => typeof c === 'string')).toBe(true);
    }
  }, 30000);

  test('should parse purposes correctly', async () => {
    const result = await privacy({ id: '553834731' });

    // Find "Data Linked to You" which has purposes
    const linkedType = result.privacyTypes.find((t) => t.privacyType.includes('Linked'));

    if (linkedType && linkedType.purposes.length > 0) {
      const purpose = linkedType.purposes[0]!;
      expect(typeof purpose.purpose).toBe('string');
      expect(Array.isArray(purpose.dataCategories)).toBe(true);

      if (purpose.dataCategories.length > 0) {
        const category = purpose.dataCategories[0]!;
        expect(typeof category.dataCategory).toBe('string');
        expect(Array.isArray(category.dataTypes)).toBe(true);
      }
    }
  }, 30000);

  test('should throw error when id is not provided', async () => {
    // @ts-expect-error Testing invalid input
    await expect(privacy({})).rejects.toThrow('id is required');
  });
});
