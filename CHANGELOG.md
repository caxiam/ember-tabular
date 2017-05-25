# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2017-05-17 - Ember v2.X.X
### Added

### Changed

### Fixed

## [0.1.0] - 2016-08-31 - Ember pre v1.13.10
### Added
- Initial base version built to support JSON API v1.0.
- Sort on a column by column basis.
- Filter on a column by column basis.
- Make physical requests to the API when filtering, sorting and paginating.
- Adds ability to filter column/table using a dropdown.
- Adds feature that allows ember-tabular to wait until controller is ready for request to fire.
- Add additional configurable wrapper classes for additional styling.
- Add subcomponent to change the table limit/count.
- Setup `autoHide` computed property to conditionally hide the limit dropdown if the results are smaller than the smallest pagination limit.
- Adds ability to persist data across transitions, setting `persistFiltering: true` and sharing the `filter`/`sort` properties with a controller/service.
- Adds ability to set column filter/sort independently.

### Changed
- Update legacy name references in README.md.
- Removed ember-canary from ember-try testing scenarios.
- Removed ember-beta from ember-try testing scenarios.
- Upgrades ember-power-select to 1.4.3, may require refactoring of `class` to `triggerClass` if applicable.
- Upgrade ember and ember-cli to 2.10.0

### Fixed
- Fix erring ember try in ember-canary, properly remove component element wrapper.
- Cleaned up code syntax to match airbnb's javascript style guide and eslint.
- Fix visual filter layout bug to use component element wrappers and refactor component templates to reduce bloat.
- When clearing filter of relationships, dot notation was not maintained.
- Fix infinite request loop by ensuring that all ember-tabular shared properties are defined within controller. Added tesing coverage to verify this.
- Fix issue when filter row is initialized and it contains existing filters an additional request would be fired.
