/**
 * Shared types for the foundation MCP server: the component catalog shape
 * (generated into catalog.json at build time) and the module graph built at
 * runtime from the layer + consumer sources.
 */

// ─── Catalog ────────────────────────────────────────────────────────────────

export const TIERS = ["common", "core", "data", "system"] as const;

export type Tier = (typeof TIERS)[number];

/**
 * Per-element metadata sourced from `config/components.ts`: the ARIA role the
 * element plays and its component-token slots mapped to their default theme
 * tokens.
 */
export interface ElementInfo {
  role: string;
  tokens: Record<string, string>;
}

/**
 * One component in the catalog. All paths are relative to the
 * `@zoobzio/foundation` package root, so `app/<dir>/...` maps 1:1 onto the
 * `@zoobzio/foundation/<dir>/...` subpath exports.
 */
export interface CatalogEntry {
  name: string;
  tier: Tier;
  /** Rendered .vue files — a single file, or every part of a family/widget. */
  components: string[];
  /** Prop/emit/passthrough contract files under `app/types/`. */
  types: string[];
  /** `define<Name>` constructor module, when the component ships one. */
  definition: string | null;
  /** Factory module, for data widgets driven by `create<Name>`. */
  factory: string | null;
  /** Element name → role + token slots, for components backed by config entries. */
  elements: Record<string, ElementInfo> | null;
}

export interface Catalog {
  foundationVersion: string;
  components: CatalogEntry[];
}

// ─── File facts (single-file scan results) ──────────────────────────────────

/** One import statement (or re-export with a source) in a file. */
export interface ImportRef {
  specifier: string;
  line: number;
  /** `type` = type-only import; erased at runtime but still a real contract edge. */
  kind: "import" | "type";
  /** Local names the statement binds — matched against template tags. */
  locals: string[];
}

/** A component tag in an SFC template matched back to the import that binds it. */
export interface RenderRef {
  specifier: string;
  tag: string;
  line: number;
}

/** Everything the scanner extracts from one source file. */
export interface FileFacts {
  imports: ImportRef[];
  exports: string[];
  renders: RenderRef[];
}

// ─── Module graph ───────────────────────────────────────────────────────────

/** One scanned source tree. The layer and the consumer app are both roots. */
export interface GraphRoot {
  /** Provenance label shown on every node (e.g. "foundation", "example"). */
  name: string;
  dir: string;
  /** Directories under `dir` to scan (e.g. ["app"], ["app", "server"]). */
  scanDirs: string[];
}

/**
 * How one module reaches another: a runtime import, a type-only import, or a
 * component tag rendered in an SFC template.
 */
export type EdgeKind = "import" | "type" | "render";

/** One occurrence of an edge in the importing file. */
export interface EdgeRef {
  line: number;
  kind: EdgeKind;
}

/** All references from one file to another, merged into a single edge. */
export interface Edge {
  from: string;
  to: string;
  refs: EdgeRef[];
}

/** Ties a layer file back to the catalog component it belongs to. */
export interface CatalogLink {
  entry: CatalogEntry;
  /** What the file is to the component: a rendered part, or a support module. */
  role: "part" | "types" | "definition" | "factory";
}

/** One module in the graph — a .vue or .ts file under some root. */
export interface GraphNode {
  /** Absolute path. */
  file: string;
  /** Path relative to its root's dir, posix separators. */
  rel: string;
  /** Root (provenance) label. */
  root: string;
  /** Nuxt-convention kind inferred from the path (component, page, composable, …). */
  kind: string;
  /** `rel` minus a leading `app/` and the extension — the query-facing name. */
  name: string;
  /** Canonical import specifier, when the file has one. */
  importPath: string | null;
  exports: string[];
  outgoing: Edge[];
  /** Imports that leave the graph (packages, Nuxt virtuals); never traversed. */
  externals: { specifier: string; line: number; kind: "import" | "type" }[];
  /** Internal-shaped imports that did not resolve to a file — surfaced, not dropped. */
  unresolved: { specifier: string; line: number }[];
  catalog: CatalogLink | null;
  /** Parse failure, if the file could not be read as a module. */
  error: string | null;
}

/** The unified module graph across every root. */
export interface Graph {
  roots: GraphRoot[];
  /** Keyed by absolute file path. */
  nodes: Map<string, GraphNode>;
  /** Incoming edges keyed by target file. */
  incoming: Map<string, Edge[]>;
}

/** A query match: a catalog component (all its files) or a single module. */
export interface Target {
  label: string;
  files: string[];
  entry: CatalogEntry | null;
}
