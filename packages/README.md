# packages/

Framework-free TypeScript packages. The kit holds the mechanisms the headless
services in [`services/`](../services/) share; the rest are the design
system's built contracts: its text, its icons, and its theme.

| Package                      | Description                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@zoobzio/kit`](./kit/)     | Shared kit: typed event emitter, state container proxy, codec and compose, and their types                                                      |
| [`@zoobzio/prose`](./prose/) | Text: every label, placeholder and notice the components render by default, built by @prosary/kit into a typed contract and a bundle per locale |
| [`@zoobzio/icons`](./icons/) | Icon contract: the roles the components leave to their icon slots, built by icon-sheets into a typed alias union, a contract, and sprites       |
| [`@zoobzio/theme`](./theme/) | Theme: the aurora preset of untheme with the foundation palette as its base and the shell's roles, built by @untheme/kit into a preset          |

Each package has its own README.
