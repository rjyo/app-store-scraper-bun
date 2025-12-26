/**
 * Get search suggestions for a term
 */

import { request, storeId } from './common.ts';
import type { Suggestion, SuggestOptions, SuggestXMLResponse } from './types.ts';

const BASE_URL =
  'https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints?clientApplication=Software&term=';

function parseXML(xmlString: string): SuggestXMLResponse {
  // Simple XML parser for the plist format returned by Apple
  // This is a basic implementation - for production, consider using a proper XML parser

  const result: SuggestXMLResponse = {
    plist: {
      dict: [
        {
          array: [
            {
              dict: [],
            },
          ],
        },
      ],
    },
  };

  // Extract all string values from dict elements
  const dictMatches = xmlString.match(/<dict>\s*<key>string<\/key>\s*<string>([^<]+)<\/string>/g);

  if (dictMatches) {
    result.plist.dict[0]!.array[0]!.dict = dictMatches.map((match) => {
      const stringMatch = match.match(/<string>([^<]+)<\/string>/);
      return {
        string: [stringMatch ? stringMatch[1]! : ''],
      };
    });
  }

  return result;
}

function extractSuggestions(xml: SuggestXMLResponse): Suggestion[] {
  const list = xml.plist.dict[0]?.array[0]?.dict || [];
  return list.map((item) => ({
    term: item.string[0]!,
  }));
}

export async function suggest(opts: SuggestOptions): Promise<Suggestion[]> {
  if (!opts?.term) {
    throw new Error('term is required');
  }

  const url = BASE_URL + encodeURIComponent(opts.term);
  const storeIdValue = storeId(opts.country);

  const body = await request(
    url,
    { 'X-Apple-Store-Front': `${storeIdValue},29` },
    opts.requestOptions
  );

  const xml = parseXML(body);
  return extractSuggestions(xml);
}
