/**
 * Fetch app lists (top apps, new apps, etc.)
 */

import { request, lookup, storeId } from './common';
import { collection as collectionConst, category as categoryConst } from './constants';
import type { App, ListApp, ListOptions, RSSFeedEntry, RSSFeedResponse } from './types';

function parseLink(app: RSSFeedEntry): string | undefined {
  if (app.link) {
    const linkArray = Array.isArray(app.link) ? app.link : [app.link];
    const link = linkArray.find((l) => l.attributes.rel === 'alternate');
    return link?.attributes.href;
  }
  return undefined;
}

function cleanListApp(app: RSSFeedEntry): ListApp {
  let developerUrl: string | undefined;
  let developerId: string | undefined;

  if (app['im:artist'].attributes) {
    developerUrl = app['im:artist'].attributes.href;

    if (app['im:artist'].attributes.href.includes('/id')) {
      developerId = app['im:artist'].attributes.href.split('/id')[1]?.split('?mt')[0];
    }
  }

  const price = parseFloat(app['im:price'].attributes.amount);

  return {
    id: app.id.attributes['im:id'],
    appId: app.id.attributes['im:bundleId'],
    title: app['im:name'].label,
    icon: app['im:image'][app['im:image'].length - 1]!.label,
    url: parseLink(app),
    price,
    currency: app['im:price'].attributes.currency,
    free: price === 0,
    description: app.summary?.label,
    developer: app['im:artist'].label,
    developerUrl,
    developerId,
    genre: app.category.attributes.label,
    genreId: app.category.attributes['im:id'],
    released: app['im:releaseDate'].label,
  };
}

function validate(opts: ListOptions): void {
  const categoryValues = Object.values(categoryConst) as number[];
  if (opts.category && !categoryValues.includes(opts.category)) {
    throw new Error('Invalid category ' + opts.category);
  }

  const col = opts.collection || collectionConst.TOP_FREE_IOS;
  const collectionValues = Object.values(collectionConst);
  if (!collectionValues.includes(col)) {
    throw new Error(`Invalid collection ${col}`);
  }

  const num = opts.num || 50;
  if (num > 200) {
    throw new Error('Cannot retrieve more than 200 apps');
  }
}

export async function list(opts: ListOptions = {}): Promise<App[] | ListApp[]> {
  const options = { ...opts };
  validate(options);

  const col = options.collection || collectionConst.TOP_FREE_IOS;
  const num = options.num || 50;
  const country = options.country || 'us';

  const categoryPath = options.category ? `/genre=${options.category}` : '';
  const storeIdValue = storeId(country);
  const url = `http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/${col}/${categoryPath}/limit=${num}/json?s=${storeIdValue}`;

  const body = await request(url, {}, options.requestOptions);
  const response = JSON.parse(body) as RSSFeedResponse;
  const apps = response.feed.entry;

  if (options.fullDetail) {
    const ids = apps.map((app) => app.id.attributes['im:id']);
    return lookup(ids, 'id', country, options.lang, options.requestOptions, options.throttle);
  }

  return apps.map(cleanListApp);
}
