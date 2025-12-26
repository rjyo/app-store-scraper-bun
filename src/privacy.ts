/**
 * Fetch app privacy details by parsing the App Store page HTML
 */

import * as cheerio from 'cheerio';
import { request } from './common';
import type { PrivacyDetails, PrivacyType, PrivacyPurpose, PrivacyDataCategory, PrivacyOptions } from './types';

export async function privacy(opts: PrivacyOptions): Promise<PrivacyDetails> {
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
  const privacyTypes: PrivacyType[] = [];

  // Find privacy articles (they have "Data Used to Track You" or "Data Linked to You" headers)
  $('article.is-detail-view').each((_, article) => {
    const $article = $(article);
    const header = $article.find('h2').first().text().trim();

    // Only process privacy-related articles
    if (!header.includes('Data')) {
      return;
    }

    const description = $article.find('p').first().text().trim();

    // Get simple data categories (from top-level list items without purpose-category class)
    const dataCategories: string[] = [];
    $article.find('> ul > li').each((_, li) => {
      const $li = $(li);
      if (!$li.hasClass('purpose-category')) {
        const category = $li.text().trim();
        if (category) {
          dataCategories.push(category);
        }
      }
    });

    // Get purposes from purpose-section elements
    const purposes: PrivacyPurpose[] = [];
    $article.find('section.purpose-section').each((_, section) => {
      const $section = $(section);
      const purposeName = $section.find('h3').first().text().trim();

      const purposeCategories: PrivacyDataCategory[] = [];
      $section.find('li.purpose-category').each((_, cat) => {
        const $cat = $(cat);
        const categoryName = $cat.find('.category-title').text().trim();
        const dataTypes: string[] = [];
        $cat.find('.privacy-data-types li').each((_, dt) => {
          dataTypes.push($(dt).text().trim());
        });

        if (categoryName) {
          purposeCategories.push({
            dataCategory: categoryName,
            dataTypes,
          });
        }
      });

      if (purposeName) {
        purposes.push({
          purpose: purposeName,
          dataCategories: purposeCategories,
        });
      }
    });

    privacyTypes.push({
      privacyType: header,
      description,
      dataCategories,
      purposes,
    });
  });

  return { privacyTypes };
}
