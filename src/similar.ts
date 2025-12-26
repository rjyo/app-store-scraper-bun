/**
 * Fetch similar apps to a given app
 */

import { app as fetchApp } from './app';
import { request, lookup, storeId } from './common';
import type { App, SimilarOptions } from './types';

const BASE_URL = 'https://itunes.apple.com/us/app/app/id';

export async function similar(opts: SimilarOptions): Promise<App[]> {
  let id: string | number;

  if (opts.id) {
    id = opts.id;
  } else if (opts.appId) {
    const result = await fetchApp(opts);
    id = result.id;
  } else {
    throw new Error('Either id or appId is required');
  }

  const storeIdValue = storeId(opts.country);

  const text = await request(
    `${BASE_URL}${id}`,
    { 'X-Apple-Store-Front': `${storeIdValue},32` },
    opts.requestOptions
  );

  const index = text.indexOf('customersAlsoBoughtApps');
  if (index === -1) {
    return [];
  }

  const regExp = /customersAlsoBoughtApps":(.*?\])/g;
  const match = regExp.exec(text);

  if (!match || !match[1]) {
    return [];
  }

  const ids = JSON.parse(match[1]) as string[];

  return lookup(ids, 'id', opts.country, opts.lang, opts.requestOptions, opts.throttle);
}
