# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one
Markdown file per change, declaring the semver bump and the release note.

Add one with `pnpm changeset` and commit it alongside your PR.

Each changeset names the workspace packages it bumps (`@zoobzio/kit`,
`@zoobzio/vue`, `@zoobzio/nuxt`, …). While pre-1.0, `minor` covers features and `patch` covers fixes — a `0.x`
release is the running alpha.

Releases are cut manually: the [Release](../.github/workflows/release.yml)
workflow (Actions tab → Run workflow, or `gh workflow run Release`) applies every
pending changeset — bumping the version, rewriting the changelog, and publishing
to npm.
