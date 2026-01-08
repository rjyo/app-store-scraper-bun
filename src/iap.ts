/**
 * Fetch in-app purchases for an app
 */

import { app as fetchApp } from './app';
import { request } from './common';
import type { InAppPurchase, IAPOptions } from './types';

interface TextPairItem {
  $kind: string;
  leadingText: string;
  trailingText: string;
}

interface InformationSection {
  title: string;
  items_V3?: TextPairItem[];
}

interface ShelfMapping {
  information?: {
    items?: InformationSection[];
  };
}

interface ServerData {
  data?: {
    shelfMapping?: ShelfMapping;
  };
}

function parseIAPFromHtml(html: string): InAppPurchase[] {
  // Find the embedded JSON data
  const jsonMatch = html.match(
    /<script type="application\/json" id="serialized-server-data">\[([\s\S]*?)\]<\/script>/
  );

  if (!jsonMatch) {
    return [];
  }

  try {
    const data = JSON.parse('[' + jsonMatch[1] + ']') as ServerData[];
    const shelfMapping = data[0]?.data?.shelfMapping;

    if (!shelfMapping?.information?.items) {
      return [];
    }

    // Find the In-App Purchases section in the information items
    const iapSection = shelfMapping.information.items.find(
      (item: InformationSection) => item.title === 'In-App Purchases'
    );

    if (!iapSection?.items_V3) {
      return [];
    }

    // Extract the text pairs (name and price)
    return iapSection.items_V3
      .filter((item: TextPairItem) => item.$kind === 'textPair')
      .map((item: TextPairItem) => ({
        name: item.leadingText,
        price: item.trailingText,
      }));
  } catch {
    return [];
  }
}

export async function iap(opts: IAPOptions): Promise<InAppPurchase[]> {
  if (!opts.id && !opts.appId) {
    throw new Error('Either id or appId is required');
  }

  let id: string | number;

  if (opts.id) {
    id = opts.id;
  } else if (opts.appId) {
    const result = await fetchApp(opts);
    id = result.id;
  } else {
    throw new Error('Either id or appId is required');
  }

  const country = opts.country || 'us';

  // Fetch the app page HTML
  const url = `https://apps.apple.com/${country}/app/id${id}`;
  const html = await request(
    url,
    {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
    },
    opts.requestOptions
  );

  if (!html || html.length === 0) {
    throw new Error('App not found (404)');
  }

  return parseIAPFromHtml(html);
}
