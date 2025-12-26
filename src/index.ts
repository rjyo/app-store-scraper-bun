/**
 * App Store Scraper - TypeScript Edition
 *
 * A strongly-typed TypeScript library for scraping app data from the iTunes App Store.
 */

// Re-export all methods
export { app } from './app';
export { list } from './list';
export { search } from './search';
export { developer } from './developer';
export { privacy } from './privacy';
export { suggest } from './suggest';
export { similar } from './similar';
export { reviews } from './reviews';
export { ratings } from './ratings';
export { versionHistory } from './version-history';

// Re-export constants
export { collection, category, device, sort, markets } from './constants';

// Re-export types
export type {
  App,
  AppWithRatings,
  ListApp,
  Review,
  RatingsResult,
  RatingsHistogram,
  PrivacyDetails,
  VersionHistoryEntry,
  Suggestion,
  Collection,
  Device,
  Sort,
  CountryCode,
  MarketId,
  AppOptions,
  ListOptions,
  SearchOptions,
  DeveloperOptions,
  PrivacyOptions,
  SuggestOptions,
  SimilarOptions,
  ReviewsOptions,
  RatingsOptions,
  VersionHistoryOptions,
  RequestOptions,
  MemoizedOptions,
} from './types';

// Import methods for memoization
import { app } from './app';
import { list } from './list';
import { search } from './search';
import { developer } from './developer';
import { privacy } from './privacy';
import { suggest } from './suggest';
import { similar } from './similar';
import { reviews } from './reviews';
import { ratings } from './ratings';
import { versionHistory } from './version-history';
import { collection, category, device, sort, markets } from './constants';
import type { MemoizedOptions } from './types';

/**
 * Simple memoization implementation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: {
    maxAge: number;
    max: number;
    normalizer: (args: unknown[]) => string;
  }
): (...args: TArgs) => Promise<TResult> {
  const cache = new Map<string, { value: TResult; timestamp: number }>();

  return async (...args: TArgs): Promise<TResult> => {
    const key = options.normalizer(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && now - cached.timestamp < options.maxAge) {
      return cached.value;
    }

    // Clean up old entries if we're at capacity
    if (cache.size >= options.max) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }

    const result = await fn(...args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

/**
 * Create a memoized version of all scraper methods
 */
export function memoized(opts: MemoizedOptions = {}) {
  const cacheOpts = {
    primitive: opts.primitive ?? true,
    normalizer: opts.normalizer ?? JSON.stringify,
    maxAge: opts.maxAge ?? 1000 * 60 * 5, // 5 minutes default
    max: opts.max ?? 1000, // 1000 entries max
  };

  return {
    // Constants
    collection,
    category,
    device,
    sort,
    markets,

    // Memoized methods
    app: memoize(app, cacheOpts),
    list: memoize(list, cacheOpts),
    search: memoize(search, cacheOpts),
    developer: memoize(developer, cacheOpts),
    privacy: memoize(privacy, cacheOpts),
    suggest: memoize(suggest, cacheOpts),
    similar: memoize(similar, cacheOpts),
    reviews: memoize(reviews, cacheOpts),
    ratings: memoize(ratings, cacheOpts),
    versionHistory: memoize(versionHistory, cacheOpts),
  };
}

// Default export with all methods and constants
export default {
  app,
  list,
  search,
  developer,
  privacy,
  suggest,
  similar,
  reviews,
  ratings,
  versionHistory,
  collection,
  category,
  device,
  sort,
  markets,
  memoized,
};
