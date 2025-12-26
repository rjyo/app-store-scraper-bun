/**
 * Fetch app ratings breakdown
 */

import * as cheerio from 'cheerio';
import { request, storeId } from './common.ts';
import type { RatingsOptions, RatingsResult, RatingsHistogram } from './types.ts';

function parseRatings(html: string): RatingsResult {
  const $ = cheerio.load(html);

  const ratingsMatch = $('.rating-count').text().match(/\d+/);
  const ratingsCount = Array.isArray(ratingsMatch) ? parseInt(ratingsMatch[0]!, 10) : 0;

  const ratingsByStar = $('.vote .total')
    .map((_, el) => parseInt($(el).text(), 10))
    .get();

  const histogram = ratingsByStar.reduce<RatingsHistogram>(
    (acc, ratingsForStar, index) => {
      const starRating = (5 - index) as 1 | 2 | 3 | 4 | 5;
      acc[starRating] = ratingsForStar;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  return { ratings: ratingsCount, histogram };
}

export async function ratings(opts: RatingsOptions): Promise<RatingsResult> {
  if (!opts.id) {
    throw new Error('id is required');
  }

  const country = opts.country || 'us';
  const storeFront = storeId(opts.country);
  const url = `https://itunes.apple.com/${country}/customer-reviews/id${opts.id}?displayable-kind=11`;

  const html = await request(
    url,
    { 'X-Apple-Store-Front': `${storeFront},12` },
    opts.requestOptions
  );

  if (html.length === 0) {
    throw new Error('App not found (404)');
  }

  return parseRatings(html);
}
