/**
 * Fetch app reviews
 */

import { app as fetchApp } from './app';
import { request } from './common';
import { sort as sortConst } from './constants';
import type { Review, ReviewsOptions, ReviewsFeedResponse, ReviewFeedEntry } from './types';

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

function cleanList(results: ReviewsFeedResponse): Review[] {
  const reviewEntries = ensureArray(results.feed.entry);

  return reviewEntries.map((review: ReviewFeedEntry) => ({
    id: review.id.label,
    userName: review.author.name.label,
    userUrl: review.author.uri.label,
    version: review['im:version'].label,
    score: parseInt(review['im:rating'].label, 10),
    title: review.title.label,
    text: review.content.label,
    url: review.link.attributes.href,
    updated: review.updated.label,
  }));
}

function validate(opts: ReviewsOptions): void {
  if (!opts.id && !opts.appId) {
    throw new Error('Either id or appId is required');
  }

  const sortValues = Object.values(sortConst);
  if (opts.sort && !sortValues.includes(opts.sort)) {
    throw new Error('Invalid sort ' + opts.sort);
  }

  if (opts.page !== undefined && opts.page < 1) {
    throw new Error('Page cannot be lower than 1');
  }

  if (opts.page !== undefined && opts.page > 10) {
    throw new Error('Page cannot be greater than 10');
  }
}

export async function reviews(opts: ReviewsOptions): Promise<Review[]> {
  validate(opts);

  let id: string | number;

  if (opts.id) {
    id = opts.id;
  } else if (opts.appId) {
    const result = await fetchApp(opts);
    id = result.id;
  } else {
    throw new Error('Either id or appId is required');
  }

  const sortBy = opts.sort || sortConst.RECENT;
  const page = opts.page || 1;
  const country = opts.country || 'us';

  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${id}/sortby=${sortBy}/json`;

  const body = await request(url, {}, opts.requestOptions);
  const response = JSON.parse(body) as ReviewsFeedResponse;

  return cleanList(response);
}
