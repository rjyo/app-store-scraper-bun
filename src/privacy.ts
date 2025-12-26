/**
 * Fetch app privacy details
 */

import { request } from './common';
import type { PrivacyDetails, PrivacyOptions } from './types';

interface PrivacyAPIResponse {
  data: Array<{
    attributes: {
      privacyDetails: PrivacyDetails;
    };
  }>;
}

export async function privacy(opts: PrivacyOptions): Promise<PrivacyDetails> {
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

  // Then fetch the privacy details
  const url = `https://amp-api-edge.apps.apple.com/v1/catalog/${country}/apps/${opts.id}?platform=web&fields=privacyDetails`;
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

  const response = JSON.parse(json) as PrivacyAPIResponse;
  return response.data[0]!.attributes.privacyDetails;
}
