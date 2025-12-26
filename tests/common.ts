/**
 * Common test utilities
 */

import { expect } from 'bun:test';
import type { App, ListApp } from '../src/types.ts';

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
      try {
        new URL('https:' + url);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export function assertValidUrl(url: string): void {
  expect(isValidUrl(url)).toBe(true);
}

export function assertValidApp(app: App | ListApp): App | ListApp {
  expect(typeof app.appId).toBe('string');
  expect(typeof app.title).toBe('string');

  if ('description' in app && app.description !== undefined) {
    expect(typeof app.description).toBe('string');
  }

  if (app.url) {
    assertValidUrl(app.url);
  }

  assertValidUrl(app.icon);

  if ('score' in app && app.score !== undefined) {
    expect(typeof app.score).toBe('number');
    expect(app.score).toBeGreaterThanOrEqual(0);
    expect(app.score).toBeLessThanOrEqual(5);
  }

  expect(typeof app.free).toBe('boolean');

  return app;
}
