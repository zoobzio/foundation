# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one
Markdown file per change, declaring the semver bump and the release note.

Add one with `pnpm changeset` and commit it alongside your PR. While pre-1.0,
`minor` covers features and `patch` covers fixes — a `0.x` release is the
running alpha.

Versioning is **fixed** — every `@zoobzio/*` package shares one version and
releases together, so a changeset for any of them bumps them all.

Releases are cut manually: the [Release](../.github/workflows/release.yml)
workflow (Actions tab → Run workflow, or `gh workflow run Release`) applies
every pending changeset — bumping the version, rewriting the changelogs, and
publishing to GitHub Packages.
