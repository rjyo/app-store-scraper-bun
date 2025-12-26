# app-store-scraper-bun

A modern, fully-typed TypeScript library for scraping public data from the Apple App Store.

[![Tests](https://img.shields.io/badge/tests-44%20passed-brightgreen)](#test-coverage)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green)](#test-coverage)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-black)](https://bun.sh/)

## Why This Rewrite?

This is a complete TypeScript rewrite of the original [app-store-scraper](https://github.com/facundoolano/app-store-scraper) library. The original library served the community well, but needed modernization:

| Aspect | Original Library | This Rewrite |
|--------|------------------|--------------|
| **Language** | JavaScript | TypeScript with full type definitions |
| **HTTP Client** | `request` (deprecated) | Native `fetch` API |
| **XML Parsing** | `xml2js` (heavy) | Lightweight custom plist parser |
| **HTML Parsing** | `cheerio` | `cheerio` (minimal usage) |
| **Runtime** | Node.js | Bun (also works with Node.js) |
| **Type Safety** | None | Comprehensive types for all APIs |
| **Dependencies** | Multiple legacy packages | Minimal modern dependencies |

### Key Benefits

- **Type Safety**: Full TypeScript support with comprehensive type definitions for all methods, options, and return types
- **Zero Legacy Dependencies**: No deprecated packages—uses native `fetch` and minimal modern dependencies
- **Faster Runtime**: Optimized for Bun with native TypeScript execution
- **Modern Async/Await**: Consistent Promise-based API throughout
- **Easy Migration**: API-compatible with the original library

## Installation

```bash
bun add app-store-scraper-bun
# or
npm install app-store-scraper-bun
```

## Quick Start

```typescript
import { app, search, list, collection, category } from 'app-store-scraper-bun';

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

## API Reference

### Methods

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

- **Collections**: `TOP_FREE_IOS`, `TOP_PAID_IOS`, `TOP_GROSSING_IOS`, `NEW_IOS`, etc.
- **Categories**: `GAMES`, `BUSINESS`, `EDUCATION`, `ENTERTAINMENT`, etc.
- **Devices**: `IPAD`, `MAC`, `ALL`
- **Sort Options**: `RECENT`, `HELPFUL`

## Advanced Usage

### Memoization (Caching)

```typescript
import { memoized } from 'app-store-scraper-bun';

// Create memoized instance with 5-minute cache
const store = memoized({ maxAge: 1000 * 60 * 5 });

// Subsequent calls with same params will use cache
const app1 = await store.app({ id: '553834731' });
const app2 = await store.app({ id: '553834731' }); // Uses cache
```

### Rate Limiting

```typescript
import { search } from 'app-store-scraper-bun';

// Limit to 2 requests per second
const results = await search({
  term: 'game',
  throttle: 2
});
```

### Fetching with Ratings

```typescript
import { app } from 'app-store-scraper-bun';

// Include ratings histogram
const result = await app({ id: '553834731', ratings: true });
console.log(result.ratings);   // Total number of ratings
console.log(result.histogram); // { '1': 1000, '2': 500, ... }
```

## Type Definitions

All methods are fully typed. Key types include:

| Type | Description |
|------|-------------|
| `App` | Full app details from lookup |
| `ListApp` | Simplified app info from list/RSS feeds |
| `AppWithRatings` | App with ratings histogram |
| `Review` | User review data |
| `Suggestion` | Search suggestion |
| `VersionHistoryEntry` | Version history entry |
| `PrivacyDetails` | App privacy information |

## Project Structure

```
src/
├── index.ts           # Main entry point with all exports
├── types.ts           # TypeScript type definitions
├── constants.ts       # App Store constants
├── common.ts          # Shared utilities
├── app.ts             # App details method
├── list.ts            # App list method
├── search.ts          # Search method
├── developer.ts       # Developer apps method
├── similar.ts         # Similar apps method
├── reviews.ts         # Reviews method
├── ratings.ts         # Ratings method
├── suggest.ts         # Search suggestions method
├── privacy.ts         # Privacy details method
└── version-history.ts # Version history method
```

## Test Coverage

```
bun test --coverage
```

| Metric | Coverage |
|--------|----------|
| **Functions** | 95.02% |
| **Lines** | 84.98% |
| **Tests** | 44 passed |
| **Assertions** | 1,616 |

### Per-File Coverage

| File | Functions | Lines |
|------|-----------|-------|
| src/app.ts | 100% | 100% |
| src/search.ts | 100% | 100% |
| src/constants.ts | 100% | 100% |
| src/developer.ts | 100% | 100% |
| src/list.ts | 100% | 97% |
| src/ratings.ts | 100% | 97% |
| src/similar.ts | 100% | 93% |
| src/reviews.ts | 100% | 87% |
| src/suggest.ts | 67% | 84% |
| src/common.ts | 64% | 76% |

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/app.test.ts

# Run with coverage
bun test --coverage
```

## Known Limitations

1. **Privacy & Version History**: These endpoints require extracting authentication tokens from Apple's web pages, which may break if Apple changes their page structure
2. **Rate Limits**: Apple may rate-limit or block requests if too many are made in a short period
3. **Data Accuracy**: Data comes from public App Store pages and APIs; some information may be region-specific

## Dependencies

- **cheerio**: HTML parsing for ratings extraction

## License

MIT
