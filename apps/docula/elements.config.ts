import { defineElement, defineElements } from "@foundation/untheme/config";

// ============================================================================
// Standalone Elements
// ============================================================================

export const container = defineElement("container", "grid");

// ============================================================================
// Compound Elements
// ============================================================================

export const community = defineElements("community", {
  root: ["flexbox"],
  content: ["flexbox"],
  item: ["flexbox", "interactive"],
});

export const versionSelect = defineElements("version-select", {
  root: [],
  trigger: ["flexbox", "interactive", "animated", "textflow"],
  content: ["positioned", "animated", "overflow"],
  item: ["interactive", "selected", "animated"],
});

export const topbar = defineElements("topbar", {
  left: ["flexbox"],
  center: ["flexbox", "grid"],
  right: ["flexbox"],
});

export const search = defineElements("search", {
  root: ["flexbox"],
  results: ["flexbox", "overflow", "positioned"],
  item: ["flexbox", "interactive", "selected"],
  icon: [],
  breadcrumb: ["flexbox"],
  separator: [],
  empty: ["flexbox"],
});
