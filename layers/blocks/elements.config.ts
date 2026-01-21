import { defineElement, defineElements } from "@foundation/untheme/config";

// ============================================================================
// Standalone Elements
// ============================================================================

export const a = defineElement("a", "flexbox", "interactive", "disabled");
export const alertNote = defineElement("alert-note", "flexbox");
export const alertNoteIcon = defineElement("alert-note-icon", "flexbox");
export const alertTip = defineElement("alert-tip", "flexbox");
export const alertTipIcon = defineElement("alert-tip-icon", "flexbox");
export const alertImportant = defineElement("alert-important", "flexbox");
export const alertImportantIcon = defineElement("alert-important-icon", "flexbox");
export const alertWarning = defineElement("alert-warning", "flexbox");
export const alertWarningIcon = defineElement("alert-warning-icon", "flexbox");
export const alertCaution = defineElement("alert-caution", "flexbox");
export const alertCautionIcon = defineElement("alert-caution-icon", "flexbox");
export const article = defineElement("article");
export const aside = defineElement("aside", "positioned", "overflow");
export const banner = defineElement("banner", "flexbox");
export const blockquote = defineElement("blockquote");
export const button = defineElement("button", "flexbox", "textflow", "interactive", "disabled", "positioned", "transform");
export const caption = defineElement("caption", "flexbox");
export const card = defineElement("card", "overflow");
export const chip = defineElement("chip", "flexbox", "textflow");
export const code = defineElement("code");
export const del = defineElement("del");
export const em = defineElement("em");
export const fab = defineElement("fab", "interactive", "disabled", "selected", "animated", "positioned", "transform");
export const footer = defineElement("footer", "grid", "flexbox");
export const group = defineElement("group", "flexbox");
export const h1 = defineElement("h1", "scrollable");
export const h2 = defineElement("h2", "scrollable");
export const h3 = defineElement("h3", "scrollable");
export const h4 = defineElement("h4", "scrollable");
export const h5 = defineElement("h5", "scrollable");
export const h6 = defineElement("h6", "scrollable");
export const header = defineElement("header", "grid", "positioned");
export const hr = defineElement("hr");
export const icon = defineElement("icon", "flexbox");
export const img = defineElement("img");
export const input = defineElements("input", {
  root: ["flexbox", "interactive"],
  prepend: ["flexbox"],
  input: [],
  append: ["flexbox"],
});
export const kbd = defineElement("kbd", "flexbox", "textflow");
export const label = defineElement("label");
export const li = defineElement("li");
export const link = defineElement("link", "flexbox", "interactive");
export const main = defineElement("main", "grid");
export const nav = defineElement("nav", "positioned", "overflow");
export const ol = defineElement("ol");
export const p = defineElement("p");
export const pre = defineElement("pre", "overflow");
export const section = defineElement("section", "grid", "flexbox");
export const strong = defineElement("strong");
export const table = defineElement("table", "table");
export const thead = defineElement("thead");
export const tbody = defineElement("tbody");
export const tr = defineElement("tr");
export const th = defineElement("th", "table");
export const td = defineElement("td", "table");
export const ul = defineElement("ul");

// ============================================================================
// Compound Elements
// ============================================================================

export const accordion = defineElements("accordion", {
  root: [],
  item: [],
  header: [],
  trigger: ["flexbox", "interactive", "selected", "animated"],
  triggerContent: ["flexbox"],
  content: [],
});

export const avatar = defineElements("avatar", {
  root: ["overflow"],
  image: [],
  fallback: ["flexbox"],
});

export const breadcrumbs = defineElements("breadcrumbs", {
  root: [],
  list: ["flexbox"],
  item: ["flexbox"],
  link: ["flexbox", "interactive", "disabled", "animated"],
  current: ["flexbox"],
  separator: ["flexbox"],
});

export const checkbox = defineElements("checkbox", {
  root: ["flexbox", "interactive", "disabled", "selected", "animated"],
  indicator: ["flexbox", "animated"],
});

export const listbox = defineElements("listbox", {
  root: [],
  content: ["flexbox"],
  item: ["flexbox", "interactive", "disabled", "selected", "animated"],
});

export const select = defineElements("select", {
  root: [],
  trigger: ["flexbox", "interactive", "animated"],
  content: ["positioned", "animated", "overflow"],
  item: ["interactive", "selected", "animated"],
});

export const tabs = defineElements("tabs", {
  root: [],
  list: ["flexbox"],
  trigger: ["flexbox", "interactive", "selected", "animated"],
  content: [],
});

export const tagsInput = defineElements("tags-input", {
  root: ["flexbox", "overflow"],
  item: ["flexbox", "textflow", "animated"],
  itemText: [],
  itemDelete: ["flexbox", "interactive", "animated"],
  input: [],
  clear: ["interactive", "animated"],
});

export const tree = defineElements("tree", {
  root: ["flexbox", "overflow"],
  branch: ["flexbox", "interactive", "open", "animated"],
  branchContent: ["flexbox"],
  branchLabel: ["flexbox"],
  leaf: ["flexbox", "interactive", "selected", "animated", "disabled"],
  leafContent: ["flexbox", "interactive", "animated"],
});

export const tooltip = defineElements("tooltip", {
  content: ["positioned", "animated", "flexbox"],
});

export const dialog = defineElements("dialog", {
  overlay: ["positioned", "animated"],
  content: ["positioned", "animated", "transform", "overflow"],
  title: [],
  description: ["textflow"],
});

export const popover = defineElements("popover", {
  trigger: ["interactive", "animated"],
  content: ["positioned", "animated", "overflow"],
  arrow: [],
  close: ["interactive", "animated"],
});

export const navigator = defineElements("navigator", {
  root: ["flexbox", "positioned"],
  list: ["flexbox"],
  item: [],
  trigger: ["flexbox", "interactive", "open", "selected", "animated"],
  link: ["flexbox", "interactive", "selected", "animated"],
  content: ["flexbox", "positioned", "animated", "overflow"],
  viewport: ["positioned", "overflow"],
  viewportWrapper: ["positioned", "flexbox"],
  indicator: ["positioned", "animated"],
  grid: ["grid"],
  card: ["flexbox", "interactive", "animated"],
  cardTitle: [],
  cardDescription: ["textflow"],
  featured: ["flexbox", "interactive", "animated"],
  featuredTitle: [],
  featuredDescription: ["textflow"],
});

export const command = defineElements("command", {
  root: ["flexbox", "overflow"],
  input: ["interactive"],
  content: ["flexbox", "overflow"],
  viewport: ["flexbox", "overflow"],
  group: ["flexbox"],
  label: ["textflow"],
  item: ["flexbox", "interactive", "selected", "animated"],
  empty: ["textflow"],
});

