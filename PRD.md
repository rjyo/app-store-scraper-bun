# App Store Scraper TypeScript - Product Requirements Document

## Overview

A strongly-typed TypeScript library for scraping public data from the Apple App Store. This is a complete rewrite of the original [app-store-scraper](https://github.com/facundoolano/app-store-scraper) JavaScript library, providing full TypeScript support with comprehensive type definitions.

## Goals

1. **Type Safety**: Provide complete TypeScript type definitions for all API methods, options, and return types
2. **Modern Stack**: Built with Bun runtime for fast execution and native TypeScript support
3. **Zero Legacy Dependencies**: Replace deprecated packages (request, xml2js) with modern alternatives (native fetch, cheerio)
4. **API Compatibility**: Maintain API compatibility with the original library for easy migration
5. **Comprehensive Testing**: Full test coverage using Bun's built-in test runner

## Features

### Core Methods

| Method | Description |
|--------|-------------|
| `app(options)` | Fetch detailed information about a single app by ID or bundle ID |
| `list(options)` | Fetch lists of apps (top free, top paid, new apps, etc.) |
| `search(options)` | Search for apps by keyword |
| `developer(options)` | Fetch all apps by a specific developer |
| `similar(options)` | Find apps similar to a given app |
| `reviews(options)` | Fetch user reviews for an app |
| `ratings(options)` | Fetch rating breakdown (histogram) for an app |
| `suggest(options)` | Get search suggestions for a term |
| `privacy(options)` | Fetch app privacy details (App Privacy labels) |
| `versionHistory(options)` | Fetch version history for an app |

### Constants

- **Collections**: TOP_FREE_IOS, TOP_PAID_IOS, TOP_GROSSING_IOS, NEW_IOS, etc.
- **Categories**: GAMES, BUSINESS, EDUCATION, ENTERTAINMENT, etc.
- **Devices**: IPAD, MAC, ALL
- **Sort Options**: RECENT, HELPFUL
- **Markets**: Country codes mapped to App Store region IDs

### Advanced Features

- **Memoization**: Built-in caching with `memoized()` function
- **Rate Limiting**: Optional request throttling to avoid API limits
- **Custom Request Options**: Support for custom headers and request configuration

## Technical Architecture

```
src/
├── index.ts          # Main entry point with all exports
├── types.ts          # TypeScript type definitions
├── constants.ts      # App Store constants (collections, categories, etc.)
├── common.ts         # Shared utilities (request, lookup, cleanApp)
├── app.ts            # App details method
├── list.ts           # App list method
├── search.ts         # Search method
├── developer.ts      # Developer apps method
├── similar.ts        # Similar apps method
├── reviews.ts        # Reviews method
├── ratings.ts        # Ratings method
├── suggest.ts        # Search suggestions method
├── privacy.ts        # Privacy details method
└── version-history.ts # Version history method

tests/
├── common.ts         # Test utilities
├── app.test.ts       # App method tests
├── list.test.ts      # List method tests
├── search.test.ts    # Search method tests
├── developer.test.ts # Developer method tests
├── ratings.test.ts   # Ratings method tests
├── reviews.test.ts   # Reviews method tests
├── suggest.test.ts   # Suggest method tests
├── similar.test.ts   # Similar method tests
├── privacy.test.ts   # Privacy method tests
└── version-history.test.ts # Version history tests
```

## Usage Examples

### Basic Usage

```typescript
import { app, search, list, collection, category } from 'app-store-scraper-ts';

// Fetch app by ID
const candyCrush = await app({ id: '553834731' });
console.log(candyCrush.title); // "Candy Crush Saga"

// Fetch app by bundle ID
const appByBundle = await app({ appId: 'com.midasplayer.apps.candycrushsaga' });

// Search for apps
const apps = await search({ term: 'puzzle games', num: 10 });

// Get top free games
const topGames = await list({
  collection: collection.TOP_FREE_IOS,
  category: category.GAMES,
  num: 50
});
```

### With Memoization

```typescript
import { memoized } from 'app-store-scraper-ts';

// Create memoized instance with 5-minute cache
const store = memoized({ maxAge: 1000 * 60 * 5 });

// Subsequent calls with same params will use cache
const app1 = await store.app({ id: '553834731' });
const app2 = await store.app({ id: '553834731' }); // Uses cache
```

### With Rate Limiting

```typescript
import { search } from 'app-store-scraper-ts';

// Limit to 2 requests per second
const results = await search({
  term: 'game',
  throttle: 2
});
```

## Type Definitions

All methods are fully typed with TypeScript. Key types include:

- `App` - Full app details from lookup
- `ListApp` - Simplified app info from list/RSS feeds
- `AppWithRatings` - App with ratings histogram
- `Review` - User review data
- `Suggestion` - Search suggestion
- `VersionHistoryEntry` - Version history entry
- `PrivacyDetails` - App privacy information

## Dependencies

- **cheerio**: HTML parsing for ratings extraction
- **bun-types**: TypeScript definitions for Bun runtime

## Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/app.test.ts
```

## Differences from Original Library

1. **TypeScript**: Full type safety with comprehensive type definitions
2. **No deprecated dependencies**: Replaced `request` with native `fetch`
3. **Simpler XML parsing**: Custom lightweight parser for suggest endpoint
4. **Bun runtime**: Optimized for Bun instead of Node.js
5. **Modern async/await**: Consistent Promise-based API

## Known Limitations

1. **Privacy & Version History**: These endpoints require extracting authentication tokens from Apple's web pages, which may break if Apple changes their page structure
2. **Rate Limits**: Apple may rate-limit or block requests if too many are made in a short period
3. **Data Accuracy**: Data comes from public App Store pages and APIs; some information may be region-specific

## License

MIT
