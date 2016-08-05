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
- Adds feature that allows ember-tabular to wait until controller is ready for request to fire.
- Add additional configurable wrapper classes for additional styling.
- Add subcomponent to change the table limit/count.

### Changed
- Update legacy name references in README.md.
- Removed ember-canary from ember-try testing scenarios.

### Fixed
- Fix erring ember try in ember-canary, properly remove component element wrapper.
- Cleaned up code syntax to match airbnb's javascript style guide and eslint.
- Fix visual filter layout bug to use component element wrappers and refactor component templates to reduce bloat.
- When clearing filter of relationships, dot notation was not maintained.
- Fix infinite request loop by ensuring that all ember-tabular shared properties are defined within controller. Added tesing coverage to verify this.
