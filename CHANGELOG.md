# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Initial base version built to support JSON API v1.0.
- Sort on a column by column basis.
- Filter on a column by column basis.
- Make physical requests to the API when filtering, sorting and paginating.
- Adds ability to filter column/table using a dropdown.

### Changed
- Update legacy name references in README.md.

### Fixed
- Fix erring ember try in ember-canary, properly remove component element wrapper.
- Cleaned up code syntax to match airbnb's javascript style guide and eslint.
- When clearing filter of relationships, dot notation was not maintained.
