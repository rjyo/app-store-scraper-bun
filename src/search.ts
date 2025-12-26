/**
 * Search for apps in the App Store
 */

import { request, lookup, storeId } from './common.ts';
import type { App, SearchOptions, SearchResponse } from './types.ts';

const BASE_URL =
  'https://search.itunes.apple.com/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=';

function paginate<T>(arr: T[], num: number, page: number): T[] {
  const pageStart = num * (page - 1);
  const pageEnd = pageStart + num;
  return arr.slice(pageStart, pageEnd);
}

export async function search(opts: SearchOptions): Promise<App[] | string[]> {
  if (!opts.term) {
    throw new Error('term is required');
  }

  const num = opts.num || 50;
  const page = opts.page || 1;
  const country = opts.country || 'us';
  const lang = opts.lang || 'en-us';

  const url = BASE_URL + encodeURIComponent(opts.term);
  const storeIdValue = storeId(country);

  const body = await request(
    url,
    {
      'X-Apple-Store-Front': `${storeIdValue},24 t:native`,
      'Accept-Language': lang,
    },
    opts.requestOptions
  );

  const response = JSON.parse(body) as SearchResponse;
  const results = response.bubbles[0]?.results || [];
  const paginatedResults = paginate(results, num, page);
  const ids = paginatedResults.map((r) => r.id);

  if (opts.idsOnly) {
    return ids;
  }

  return lookup(ids, 'id', country, opts.lang, opts.requestOptions, opts.throttle);
}
