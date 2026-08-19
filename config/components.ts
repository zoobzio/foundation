import type { RoleAria } from "../app/types/aria-spec";
import type { Token } from "../app/types/token";

interface ComponentConfig {
  elements: Record<
    string,
    {
      role: keyof RoleAria;
      tokens: Record<string, Token>;
    }
  >;
  compounds: Record<string, Record<string, never>>;
  widgets?: never;
  structures?: never;
}

/**
 * The design-system component registry, grouped by layer.
 *
 * Shared source of truth for the component type surface (aria, tokens) and
 * the component-token plugin. Each key is a layer mapping that layer's
 * components to their structured config; new layers are added alongside
 * `elements`, and consumers read the layer they target (e.g.
 * `components.elements`). Declared `as const satisfies` so the literal names
 * drive each schema's key type while every entry's fields are validated —
 * adding a component without its full config is a type error, so completeness
 * holds by construction.
 *
 * `role` — the ARIA role an element plays. Each element plays exactly one
 * role, so a component only ever tracks a single `Element` generic: the `aria`
 * surface is resolved from this field (see `ComponentRole` / `AriaProps`)
 * rather than the author restating the role. Most entries are the implicit
 * role of the underlying element; the semantic components that have no 1:1
 * HTML element (`card`, `chip`, `container`, `icon`) are a design choice.
 * Validity is checked against the generated role registry — no dependency on
 * the aria derivation layer that consumes this map.
 *
 * Native-event emits are not config: each component declares its own contract
 * in its type file via `EventEmits<...>` (see `app/types/events.ts`) — the
 * component is both the decision site and the wiring site.
 *
 * `tokens` — the element's component-token slots, each mapped to its semantic
 * default theme token. The system owns the slot vocabulary and its defaults:
 * `plugins/tokens` renders them as a `<style>` tag at body open — after the
 * theme's `<head>` tokens in the cascade — so `var(--<slot>)` is always
 * defined under `.f-<element>`. The only override mechanism is the
 * per-instance `tokens` prop (`TokenProps` resolves the slot names straight
 * from this map), which inlines the vars on the element itself and wins by
 * cascade. An empty object is the explicit statement that the element
 * declares no component tokens; validity of each default is checked against
 * the theme contract's `Token`s.
 */
export default {
  elements: {
    "accordion-content": { role: "region", tokens: {} },
    "accordion-header": { role: "heading", tokens: {} },
    "accordion-item": { role: "generic", tokens: {} },
    "accordion-root": { role: "generic", tokens: {} },
    "accordion-trigger": { role: "button", tokens: {} },
    alert: { role: "alert", tokens: {} },
    anchor: { role: "link", tokens: {} },
    article: { role: "article", tokens: {} },
    aside: { role: "complementary", tokens: {} },
    "avatar-fallback": { role: "generic", tokens: {} },
    "avatar-image": { role: "img", tokens: {} },
    "avatar-root": { role: "img", tokens: {} },
    banner: { role: "banner", tokens: {} },
    blockquote: { role: "blockquote", tokens: {} },
    button: {
      role: "button",
      tokens: { bg: "primary-500", fg: "primary-50" },
    },
    "calendar-cell": { role: "cell", tokens: {} },
    "calendar-cell-trigger": { role: "button", tokens: {} },
    "calendar-grid": { role: "grid", tokens: {} },
    "calendar-grid-body": { role: "rowgroup", tokens: {} },
    "calendar-grid-head": { role: "rowgroup", tokens: {} },
    "calendar-grid-row": { role: "row", tokens: {} },
    "calendar-head-cell": { role: "columnheader", tokens: {} },
    "calendar-header": { role: "generic", tokens: {} },
    "calendar-heading": { role: "generic", tokens: {} },
    "calendar-next": { role: "button", tokens: {} },
    "calendar-prev": { role: "button", tokens: {} },
    "calendar-root": { role: "group", tokens: {} },
    caption: { role: "caption", tokens: {} },
    card: { role: "group", tokens: {} },
    "checkbox-root": { role: "checkbox", tokens: {} },
    chip: { role: "button", tokens: {} },
    code: { role: "code", tokens: {} },
    container: { role: "generic", tokens: {} },
    "date-picker-calendar": { role: "group", tokens: {} },
    "date-picker-cell": { role: "cell", tokens: {} },
    "date-picker-cell-trigger": {
      role: "button",
      tokens: {},
    },
    "date-picker-content": { role: "dialog", tokens: {} },
    "date-picker-field": { role: "group", tokens: {} },
    "date-picker-grid": { role: "grid", tokens: {} },
    "date-picker-grid-body": { role: "rowgroup", tokens: {} },
    "date-picker-grid-head": { role: "rowgroup", tokens: {} },
    "date-picker-grid-row": { role: "row", tokens: {} },
    "date-picker-head-cell": { role: "columnheader", tokens: {} },
    "date-picker-header": { role: "generic", tokens: {} },
    "date-picker-heading": { role: "generic", tokens: {} },
    "date-picker-input": { role: "spinbutton", tokens: {} },
    "date-picker-next": { role: "button", tokens: {} },
    "date-picker-prev": { role: "button", tokens: {} },
    "date-picker-root": { role: "group", tokens: {} },
    "date-picker-trigger": { role: "button", tokens: {} },
    "date-range-picker-calendar": { role: "group", tokens: {} },
    "date-range-picker-cell": { role: "cell", tokens: {} },
    "date-range-picker-cell-trigger": {
      role: "button",
      tokens: {},
    },
    "date-range-picker-content": { role: "dialog", tokens: {} },
    "date-range-picker-field": { role: "group", tokens: {} },
    "date-range-picker-grid": { role: "grid", tokens: {} },
    "date-range-picker-grid-body": { role: "rowgroup", tokens: {} },
    "date-range-picker-grid-head": { role: "rowgroup", tokens: {} },
    "date-range-picker-grid-row": { role: "row", tokens: {} },
    "date-range-picker-head-cell": {
      role: "columnheader",
      tokens: {},
    },
    "date-range-picker-header": { role: "generic", tokens: {} },
    "date-range-picker-heading": { role: "generic", tokens: {} },
    "date-range-picker-input": { role: "spinbutton", tokens: {} },
    "date-range-picker-next": { role: "button", tokens: {} },
    "date-range-picker-prev": { role: "button", tokens: {} },
    "date-range-picker-root": { role: "group", tokens: {} },
    "date-range-picker-trigger": {
      role: "button",
      tokens: {},
    },
    del: { role: "deletion", tokens: {} },
    "dialog-content": { role: "dialog", tokens: {} },
    "dialog-description": { role: "paragraph", tokens: {} },
    "dialog-overlay": { role: "generic", tokens: {} },
    "dialog-title": { role: "heading", tokens: {} },
    "dropdown-menu-content": { role: "menu", tokens: {} },
    "dropdown-menu-group": { role: "group", tokens: {} },
    "dropdown-menu-item": { role: "menuitem", tokens: {} },
    "dropdown-menu-label": { role: "generic", tokens: {} },
    "dropdown-menu-separator": { role: "separator", tokens: {} },
    "dropdown-menu-trigger": { role: "button", tokens: {} },
    em: { role: "emphasis", tokens: {} },
    fieldset: { role: "group", tokens: {} },
    footer: { role: "contentinfo", tokens: {} },
    form: { role: "form", tokens: {} },
    group: { role: "group", tokens: {} },
    h1: { role: "heading", tokens: {} },
    h2: { role: "heading", tokens: {} },
    h3: { role: "heading", tokens: {} },
    h4: { role: "heading", tokens: {} },
    h5: { role: "heading", tokens: {} },
    h6: { role: "heading", tokens: {} },
    header: { role: "banner", tokens: {} },
    hr: { role: "separator", tokens: {} },
    icon: { role: "img", tokens: {} },
    img: { role: "img", tokens: {} },
    input: {
      role: "textbox",
      tokens: {},
    },
    kbd: { role: "generic", tokens: {} },
    label: { role: "generic", tokens: {} },
    li: { role: "listitem", tokens: {} },
    "listbox-content": { role: "listbox", tokens: {} },
    "listbox-filter": { role: "textbox", tokens: {} },
    "listbox-group": { role: "group", tokens: {} },
    "listbox-group-label": { role: "generic", tokens: {} },
    "listbox-item": { role: "option", tokens: {} },
    main: { role: "main", tokens: {} },
    nav: { role: "navigation", tokens: {} },
    ol: { role: "list", tokens: {} },
    p: { role: "paragraph", tokens: {} },
    "popover-anchor": { role: "generic", tokens: {} },
    "popover-arrow": { role: "generic", tokens: {} },
    "popover-close": { role: "button", tokens: {} },
    "popover-content": { role: "dialog", tokens: {} },
    "popover-trigger": { role: "button", tokens: {} },
    pre: { role: "generic", tokens: {} },
    "radio-group-indicator": { role: "generic", tokens: {} },
    "radio-group-item": { role: "radio", tokens: {} },
    "radio-group-root": { role: "radiogroup", tokens: {} },
    "range-calendar-cell": { role: "cell", tokens: {} },
    "range-calendar-cell-trigger": {
      role: "button",
      tokens: {},
    },
    "range-calendar-grid": { role: "grid", tokens: {} },
    "range-calendar-grid-body": { role: "rowgroup", tokens: {} },
    "range-calendar-grid-head": { role: "rowgroup", tokens: {} },
    "range-calendar-grid-row": { role: "row", tokens: {} },
    "range-calendar-head-cell": {
      role: "columnheader",
      tokens: {},
    },
    "range-calendar-header": { role: "generic", tokens: {} },
    "range-calendar-heading": { role: "generic", tokens: {} },
    "range-calendar-next": { role: "button", tokens: {} },
    "range-calendar-prev": { role: "button", tokens: {} },
    "range-calendar-root": { role: "group", tokens: {} },
    "scroll-area-corner": { role: "generic", tokens: {} },
    "scroll-area-root": { role: "generic", tokens: {} },
    "scroll-area-scrollbar": { role: "scrollbar", tokens: {} },
    "scroll-area-thumb": { role: "generic", tokens: {} },
    "scroll-area-viewport": { role: "generic", tokens: {} },
    section: { role: "region", tokens: {} },
    "select-content": { role: "listbox", tokens: {} },
    "select-item": { role: "option", tokens: {} },
    "select-item-text": { role: "generic", tokens: {} },
    "select-trigger": { role: "combobox", tokens: {} },
    span: { role: "generic", tokens: {} },
    strong: { role: "strong", tokens: {} },
    table: { role: "table", tokens: {} },
    "tabs-content": { role: "tabpanel", tokens: {} },
    "tabs-list": { role: "tablist", tokens: {} },
    "tabs-root": { role: "generic", tokens: {} },
    "tabs-trigger": { role: "tab", tokens: {} },
    "tags-input-input": { role: "textbox", tokens: {} },
    "tags-input-item": { role: "generic", tokens: {} },
    "tags-input-item-delete": { role: "button", tokens: {} },
    "tags-input-item-text": { role: "generic", tokens: {} },
    "tags-input-root": { role: "group", tokens: {} },
    tbody: { role: "rowgroup", tokens: {} },
    td: { role: "cell", tokens: {} },
    textarea: {
      role: "textbox",
      tokens: {},
    },
    th: { role: "columnheader", tokens: {} },
    thead: { role: "rowgroup", tokens: {} },
    "toast-close": { role: "button", tokens: {} },
    "toast-description": { role: "generic", tokens: {} },
    "toast-root": { role: "status", tokens: {} },
    "toast-title": { role: "generic", tokens: {} },
    "toast-viewport": { role: "region", tokens: {} },
    "toggle-group-item": { role: "button", tokens: {} },
    "toggle-group-root": { role: "group", tokens: {} },
    "tooltip-content": { role: "tooltip", tokens: {} },
    "tooltip-trigger": { role: "button", tokens: {} },
    tr: { role: "row", tokens: {} },
    ul: { role: "list", tokens: {} },
  },
  compounds: {
    accordion: {},
    avatar: {},
    calendar: {},
    checkbox: {},
    command: {},
    "date-filters": {},
    "date-picker": {},
    "date-range-picker": {},
    dialog: {},
    directory: {},
    fab: {},
    facets: {},
    hero: {},
    keywords: {},
    listbox: {},
    menu: {},
    "multi-select": {},
    pagination: {},
    popover: {},
    radio: {},
    "range-calendar": {},
    scroller: {},
    "segmented-control": {},
    select: {},
    tabs: {},
    "tags-input": {},
    toast: {},
    toaster: {},
    tooltip: {},
  },
} as const satisfies ComponentConfig;
