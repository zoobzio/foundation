---
"@zoobzio/foundation-mcp": patch
---

Add deterministic module-graph query tools: `resolve`, `usages`,
`dependencies`, and `dependents`. The server scans the installed layer and
the consuming Nuxt app into one unified import graph (script imports,
type-only imports, and SFC template render sites, with line numbers),
annotates layer files with their catalog identity, and answers
"where is X / what uses X / what is X built from / what breaks if X
changes" without filesystem exploration. Consumer root is cwd when it holds
a nuxt config, or `FOUNDATION_MCP_APP_DIR`.
