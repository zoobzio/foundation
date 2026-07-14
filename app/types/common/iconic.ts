// Stopgap for the extracted `@zoobz-io/iconic` module (not yet published).
// Iconic originally provided `IconAlias` (a union of registered icon keys:
// `type IconAlias = keyof IconAliases`) as a global auto-import. Until iconic
// ships, we widen it to `string` so icon props keep type-checking. On
// reintegration, replace this with: export type { IconAlias } from "@zoobz-io/iconic";
export type IconAlias = string;
