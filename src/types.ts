/**
 * App Store Scraper TypeScript Types
 */

// ============================================================================
// Constants Types
// ============================================================================

export type Collection =
  | 'topmacapps'
  | 'topfreemacapps'
  | 'topgrossingmacapps'
  | 'toppaidmacapps'
  | 'newapplications'
  | 'newfreeapplications'
  | 'newpaidapplications'
  | 'topfreeapplications'
  | 'topfreeipadapplications'
  | 'topgrossingapplications'
  | 'topgrossingipadapplications'
  | 'toppaidapplications'
  | 'toppaidipadapplications';

export type Device = 'iPadSoftware' | 'macSoftware' | 'software';

export type Sort = 'mostRecent' | 'mostHelpful';

export type CountryCode = string;

export type MarketId = number;

// ============================================================================
// App Data Types
// ============================================================================

export interface App {
  id: number | string;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: string[];
  genreIds: string[];
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: string[];
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  releaseNotes: string;
  version: string;
  price: number | string;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  developerWebsite?: string;
  score: number;
  reviews: number;
  currentVersionScore: number;
  currentVersionReviews: number;
  screenshots: string[];
  ipadScreenshots: string[];
  appletvScreenshots: string[];
  supportedDevices: string[];
}

export interface AppWithRatings extends App {
  ratings: number;
  histogram: RatingsHistogram;
}

export interface ListApp {
  id: string;
  appId: string;
  title: string;
  icon: string;
  url: string | undefined;
  price: number;
  currency: string;
  free: boolean;
  description?: string;
  developer: string;
  developerUrl?: string;
  developerId?: string;
  genre: string;
  genreId: string;
  released: string;
}

// ============================================================================
// Ratings Types
// ============================================================================

export interface RatingsHistogram {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface RatingsResult {
  ratings: number;
  histogram: RatingsHistogram;
}

// ============================================================================
// Reviews Types
// ============================================================================

export interface Review {
  id: string;
  userName: string;
  userUrl: string;
  version: string;
  score: number;
  title: string;
  text: string;
  url: string;
  updated: string;
}

// ============================================================================
// Privacy Types
// ============================================================================

export interface PrivacyDetails {
  managePrivacyChoicesUrl: string | null;
  privacyTypes: PrivacyType[];
}

export interface PrivacyType {
  privacyType: string;
  identifier: string;
  description: string;
  dataCategories: PrivacyDataCategory[];
  purposes: PrivacyPurpose[];
}

export interface PrivacyDataCategory {
  dataCategory: string;
  identifier: string;
  dataTypes: string[];
}

export interface PrivacyPurpose {
  purpose: string;
  identifier: string;
  dataCategories: PrivacyDataCategory[];
}

// ============================================================================
// Version History Types
// ============================================================================

export interface VersionHistoryEntry {
  versionDisplay: string;
  releaseDate: string;
  releaseNotes?: string;
}

// ============================================================================
// Suggestion Types
// ============================================================================

export interface Suggestion {
  term: string;
}

// ============================================================================
// Request Options Types
// ============================================================================

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  timeout?: number;
}

// ============================================================================
// Method Options Types
// ============================================================================

export interface BaseOptions {
  country?: string;
  lang?: string;
  requestOptions?: RequestOptions;
  throttle?: number;
}

export interface AppOptions extends BaseOptions {
  id?: number | string;
  appId?: string;
  ratings?: boolean;
}

export interface ListOptions extends BaseOptions {
  collection?: Collection;
  category?: number;
  num?: number;
  fullDetail?: boolean;
}

export interface SearchOptions extends BaseOptions {
  term: string;
  num?: number;
  page?: number;
  idsOnly?: boolean;
}

export interface DeveloperOptions extends BaseOptions {
  devId: number | string;
}

export interface PrivacyOptions extends BaseOptions {
  id: number | string;
}

export interface SuggestOptions extends BaseOptions {
  term: string;
}

export interface SimilarOptions extends BaseOptions {
  id?: number | string;
  appId?: string;
}

export interface ReviewsOptions extends BaseOptions {
  id?: number | string;
  appId?: string;
  sort?: Sort;
  page?: number;
}

export interface RatingsOptions extends BaseOptions {
  id: number | string;
}

export interface VersionHistoryOptions extends BaseOptions {
  id: number | string;
}

export interface MemoizedOptions {
  maxAge?: number;
  max?: number;
  primitive?: boolean;
  normalizer?: (args: unknown[]) => string;
}

// ============================================================================
// iTunes API Response Types (Raw)
// ============================================================================

export interface ITunesLookupResponse {
  resultCount: number;
  results: ITunesApp[];
}

export interface ITunesApp {
  trackId: number;
  bundleId: string;
  trackName: string;
  trackViewUrl: string;
  description: string;
  artworkUrl512?: string;
  artworkUrl100?: string;
  artworkUrl60?: string;
  genres: string[];
  genreIds: string[];
  primaryGenreName: string;
  primaryGenreId: number;
  contentAdvisoryRating: string;
  languageCodesISO2A: string[];
  fileSizeBytes: string;
  minimumOsVersion: string;
  releaseDate: string;
  currentVersionReleaseDate?: string;
  releaseNotes: string;
  version: string;
  price: number;
  currency: string;
  artistId: number;
  artistName: string;
  artistViewUrl: string;
  sellerUrl?: string;
  averageUserRating: number;
  userRatingCount: number;
  averageUserRatingForCurrentVersion: number;
  userRatingCountForCurrentVersion: number;
  screenshotUrls: string[];
  ipadScreenshotUrls: string[];
  appletvScreenshotUrls: string[];
  supportedDevices: string[];
  wrapperType?: string;
}

export interface RSSFeedResponse {
  feed: {
    entry: RSSFeedEntry[];
  };
}

export interface RSSFeedEntry {
  id: {
    label: string;
    attributes: {
      'im:id': string;
      'im:bundleId': string;
    };
  };
  'im:name': { label: string };
  'im:image': Array<{ label: string }>;
  link?: Array<{ attributes: { rel: string; href: string } }> | { attributes: { rel: string; href: string } };
  'im:price': {
    label: string;
    attributes: { amount: string; currency: string };
  };
  summary?: { label: string };
  'im:artist': {
    label: string;
    attributes?: { href: string };
  };
  category: {
    attributes: { label: string; 'im:id': string };
  };
  'im:releaseDate': { label: string };
}

export interface SearchResponse {
  bubbles: Array<{
    results?: Array<{ id: string }>;
  }>;
}

export interface ReviewsFeedResponse {
  feed: {
    entry?: ReviewFeedEntry | ReviewFeedEntry[];
  };
}

export interface ReviewFeedEntry {
  id: { label: string };
  author: {
    name: { label: string };
    uri: { label: string };
  };
  'im:version': { label: string };
  'im:rating': { label: string };
  title: { label: string };
  content: { label: string };
  link: { attributes: { href: string } };
  updated: { label: string };
}

export interface SuggestXMLResponse {
  plist: {
    dict: Array<{
      array: Array<{
        dict?: Array<{
          string: string[];
        }>;
      }>;
    }>;
  };
}
