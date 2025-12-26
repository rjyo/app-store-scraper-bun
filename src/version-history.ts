/**
 * Fetch app version history
 */

import { request } from './common';
import type { VersionHistoryEntry, VersionHistoryOptions } from './types';

interface VersionHistoryAPIResponse {
  data: Array<{
    attributes: {
      platformAttributes: {
        ios: {
          versionHistory: VersionHistoryEntry[];
        };
      };
    };
  }>;
}

export async function versionHistory(opts: VersionHistoryOptions): Promise<VersionHistoryEntry[]> {
  if (!opts.id) {
    throw new Error('id is required');
  }

  const country = opts.country || 'US';

  // First fetch the app page to get the auth token
  const tokenUrl = `https://apps.apple.com/${country}/app/id${opts.id}`;
  const html = await request(tokenUrl, {}, opts.requestOptions);

  const regExp = /token%22%3A%22([^%]+)%22%7D/g;
  const match = regExp.exec(html);

  if (!match || !match[1]) {
    throw new Error('Could not find authentication token');
  }

  const token = match[1];

  // Then fetch the version history
  const url = `https://amp-api-edge.apps.apple.com/v1/catalog/${country}/apps/${opts.id}?platform=web&extend=versionHistory&additionalPlatforms=appletv,ipad,iphone,mac,realityDevice`;

  const json = await request(
    url,
    {
      Origin: 'https://apps.apple.com',
      Authorization: `Bearer ${token}`,
    },
    opts.requestOptions
  );

  if (json.length === 0) {
    throw new Error('App not found (404)');
  }

  const response = JSON.parse(json) as VersionHistoryAPIResponse;
  return response.data[0]!.attributes.platformAttributes.ios.versionHistory;
}
