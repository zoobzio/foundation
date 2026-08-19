---
"@zoobzio/foundation-mcp": patch
---

Add a `health` tool: a graph-wide report that aggregates the diagnostics
the module graph already collects into one actionable summary — parse
errors, unresolved imports, and catalog drift (errors); import cycles
(with type-only cycles labeled), tier-layering violations
(common < core < data < system), dead-code candidates, and
imported-but-never-rendered components (warnings); blast-radius hotspots
and catalog adoption by the consuming app (info). Empty sections are
omitted; pass `section` to get one section in full detail.
