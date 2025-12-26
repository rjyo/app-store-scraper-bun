/**
 * Common utilities for App Store Scraper
 */

import { markets, DEFAULT_STORE_ID } from './constants.ts';
import type { App, ITunesApp, ITunesLookupResponse, RequestOptions } from './types.ts';

const LOOKUP_URL = 'https://itunes.apple.com/lookup';

/**
 * Clean and normalize app data from iTunes API response
 */
export function cleanApp(app: ITunesApp): App {
  return {
    id: app.trackId,
    appId: app.bundleId,
    title: app.trackName,
    url: app.trackViewUrl,
    description: app.description,
    icon: app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60 || '',
    genres: app.genres,
    genreIds: app.genreIds,
    primaryGenre: app.primaryGenreName,
    primaryGenreId: app.primaryGenreId,
    contentRating: app.contentAdvisoryRating,
    languages: app.languageCodesISO2A,
    size: app.fileSizeBytes,
    requiredOsVersion: app.minimumOsVersion,
    released: app.releaseDate,
    updated: app.currentVersionReleaseDate || app.releaseDate,
    releaseNotes: app.releaseNotes,
    version: app.version,
    price: app.price,
    currency: app.currency,
    free: app.price === 0,
    developerId: app.artistId,
    developer: app.artistName,
    developerUrl: app.artistViewUrl,
    developerWebsite: app.sellerUrl,
    score: app.averageUserRating,
    reviews: app.userRatingCount,
    currentVersionScore: app.averageUserRatingForCurrentVersion,
    currentVersionReviews: app.userRatingCountForCurrentVersion,
    screenshots: app.screenshotUrls || [],
    ipadScreenshots: app.ipadScreenshotUrls || [],
    appletvScreenshots: app.appletvScreenshotUrls || [],
    supportedDevices: app.supportedDevices || [],
  };
}

/**
 * Rate limiter for throttling requests
 */
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per millisecond

  constructor(requestsPerSecond: number) {
    this.maxTokens = requestsPerSecond;
    this.tokens = requestsPerSecond;
    this.lastRefill = Date.now();
    this.refillRate = requestsPerSecond / 1000;
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Wait until we have a token
    const waitTime = (1 - this.tokens) / this.refillRate;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    this.refill();
    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

const rateLimiters = new Map<number, RateLimiter>();

function getRateLimiter(limit: number): RateLimiter {
  let limiter = rateLimiters.get(limit);
  if (!limiter) {
    limiter = new RateLimiter(limit);
    rateLimiters.set(limit, limiter);
  }
  return limiter;
}

/**
 * Make an HTTP request with optional throttling
 */
export async function request(
  url: string,
  headers: Record<string, string> = {},
  requestOptions: RequestOptions = {},
  limit?: number
): Promise<string> {
  // Apply rate limiting if specified
  if (limit) {
    const limiter = getRateLimiter(limit);
    await limiter.acquire();
  }

  const method = requestOptions.method || 'GET';

  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      ...requestOptions.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`) as Error & {
      response: { statusCode: number };
    };
    error.response = { statusCode: response.status };
    throw error;
  }

  return response.text();
}

/**
 * Lookup apps by ID or bundle ID
 */
export async function lookup(
  ids: (string | number)[],
  idField: 'id' | 'bundleId' = 'id',
  country = 'us',
  lang?: string,
  requestOptions: RequestOptions = {},
  limit?: number
): Promise<App[]> {
  const langParam = lang ? `&lang=${lang}` : '';
  const joinedIds = ids.join(',');
  const url = `${LOOKUP_URL}?${idField}=${joinedIds}&country=${country}&entity=software${langParam}`;

  const body = await request(url, {}, requestOptions, limit);
  const response = JSON.parse(body) as ITunesLookupResponse;

  const apps = response.results.filter(
    (app) => typeof app.wrapperType === 'undefined' || app.wrapperType === 'software'
  );

  return apps.map(cleanApp);
}

/**
 * Get the store ID for a country code
 */
export function storeId(countryCode?: string): number {
  if (!countryCode) {
    return DEFAULT_STORE_ID;
  }
  return markets[countryCode.toUpperCase()] || DEFAULT_STORE_ID;
}
