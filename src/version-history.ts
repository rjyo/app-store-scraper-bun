/**
 * Fetch app version history by parsing the App Store page HTML
 */

import * as cheerio from 'cheerio';
import { request } from './common';
import type { VersionHistoryEntry, VersionHistoryOptions } from './types';

export async function versionHistory(opts: VersionHistoryOptions): Promise<VersionHistoryEntry[]> {
  if (!opts.id) {
    throw new Error('id is required');
  }

  const country = opts.country || 'us';

  // Fetch the app page HTML
  const url = `https://apps.apple.com/${country}/app/id${opts.id}`;
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

  const $ = cheerio.load(html);
  const entries: VersionHistoryEntry[] = [];

  // Find all version history articles
  // Structure: <article class="svelte-* detail"><div class="container"><p>notes</p><div class="metadata"><h4>version</h4><time datetime="date">date</time></div></div></article>
  $('article.detail').each((_, article) => {
    const $article = $(article);
    const $container = $article.find('.container');

    const releaseNotes = $container.find('p').first().text().trim();
    const versionDisplay = $container.find('.metadata h4').text().trim();
    const $time = $container.find('.metadata time');
    const releaseDate = $time.attr('datetime') || '';

    if (versionDisplay) {
      entries.push({
        versionDisplay,
        releaseDate,
        releaseNotes: releaseNotes || undefined,
      });
    }
  });

  return entries;
}
