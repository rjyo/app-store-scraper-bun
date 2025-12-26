/**
 * Fetch app details by ID or bundle ID
 */

import { lookup } from './common.ts';
import { ratings } from './ratings.ts';
import type { App, AppOptions, AppWithRatings } from './types.ts';

export async function app(opts: AppOptions): Promise<App | AppWithRatings> {
  if (!opts.id && !opts.appId) {
    throw new Error('Either id or appId is required');
  }

  const idField = opts.id ? 'id' : 'bundleId';
  const idValue = opts.id || opts.appId;

  const results = await lookup(
    [idValue!],
    idField,
    opts.country,
    opts.lang,
    opts.requestOptions,
    opts.throttle
  );

  if (results.length === 0) {
    throw new Error('App not found (404)');
  }

  const result = results[0]!;

  if (opts.ratings) {
    const id = opts.id || result.id;
    const ratingsResult = await ratings({
      id,
      country: opts.country,
      requestOptions: opts.requestOptions,
    });
    return { ...result, ...ratingsResult } as AppWithRatings;
  }

  return result;
}
