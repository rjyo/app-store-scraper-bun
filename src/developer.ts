/**
 * Fetch apps by developer ID
 */

import { lookup } from './common.ts';
import type { App, DeveloperOptions } from './types.ts';

export async function developer(opts: DeveloperOptions): Promise<App[]> {
  if (!opts.devId) {
    throw new Error('devId is required');
  }

  const results = await lookup(
    [opts.devId],
    'id',
    opts.country,
    opts.lang,
    opts.requestOptions,
    opts.throttle
  );

  if (results.length === 0) {
    throw new Error('Developer not found (404)');
  }

  return results;
}
