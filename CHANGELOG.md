# Changelog

## v1.1.0 (2025-12-26)

### Fixed

- **Privacy endpoint now works**: Rewrote `privacy()` to parse data directly from App Store HTML instead of using Apple's authenticated API which was broken
- **Version History endpoint now works**: Rewrote `versionHistory()` to parse data directly from App Store HTML instead of using Apple's authenticated API which was broken

### Changed

- Simplified `PrivacyDetails` type structure to match HTML-parsed data
- Both `privacy()` and `versionHistory()` now set a proper User-Agent header for reliable fetching

### Improved

- Test coverage increased from 85% to **95%**
- Added comprehensive tests for privacy and version history endpoints
- Added rate limiter tests
- Added memoization cache hit tests

### Technical Details

The previous implementation tried to extract authentication tokens from Apple's web pages to call their private API. Apple moved to a Svelte SPA which broke this approach. The new implementation parses the data directly from the HTML, which is more reliable and doesn't require authentication.

---

## v1.0.0 (2025-12-25)

Initial release - complete TypeScript rewrite of [app-store-scraper](https://github.com/facundoolano/app-store-scraper).

### Features

- Full TypeScript support with comprehensive type definitions
- Modern async/await API
- Native `fetch` instead of deprecated `request` package
- Memoization support with configurable cache
- Rate limiting with `throttle` option
- All original methods: `app`, `list`, `search`, `developer`, `similar`, `reviews`, `ratings`, `suggest`, `privacy`, `versionHistory`
