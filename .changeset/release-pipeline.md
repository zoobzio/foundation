---
"@zoobzio/foundation": patch
---

Fix the release pipeline and move releases to the `latest` dist-tag.

- The release workflow now upgrades npm before publishing: OIDC trusted publishing requires npm ≥ 11.5.1, and Node 22's bundled npm 10.x silently skipped the token exchange, hitting the registry unauthenticated (the E404-on-PUT failure).
- Dropped `publishConfig.tag: "alpha"` — releases publish to `latest`, so plain installs resolve the current version.
