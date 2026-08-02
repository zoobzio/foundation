import type { RoleAria } from "#build/types/aria";
import type { Token } from "#foundation/types/tokens";

interface ComponentConfig {
  elements: Record<
    string,
    {
      role: keyof RoleAria;
      events: readonly (keyof GlobalEventHandlersEventMap)[];
      tokens: Record<string, Token>;
    }
  >;
  compounds: Record<
    string,
    { events: readonly (keyof GlobalEventHandlersEventMap)[] }
  >;
}

/**
 * The design-system component registry, grouped by layer.
 *
 * Shared source of truth for the per-component generation modules (modifiers,
 * component tokens, events, aria). Each key is a layer mapping that layer's
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
 * `events` — the native HTML events the component semantically surfaces as
 * emits: the events a consumer may listen for, and the passthrough system may
 * wire through `pt` (see `EventEmits`). The curation is a design choice, not
 * "everything the DOM allows": an entry earns an event when listening to it on
 * that component is part of its contract (a button's `click`, an input's
 * `input`). An empty list is the explicit statement that the component
 * surfaces no native events; validity is checked against the DOM's own event
 * map.
 *
 * A listed event is delivered by explicit re-emit, not attr fallthrough: the
 * component declares it via `defineEmits<EventEmits<...>>` and re-emits from
 * its root (`@click="emit('click', $event)"`). Declaring an emit removes the
 * listener from `$attrs`, so listing an event here without wiring the re-emit
 * leaves it silently dead.
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
    "accordion-content": { role: "region", events: [], tokens: {} },
    "accordion-header": { role: "heading", events: [], tokens: {} },
    "accordion-item": { role: "generic", events: [], tokens: {} },
    "accordion-root": { role: "generic", events: [], tokens: {} },
    "accordion-trigger": { role: "button", events: ["click"], tokens: {} },
    alert: { role: "alert", events: [], tokens: {} },
    anchor: { role: "link", events: ["click"], tokens: {} },
    article: { role: "article", events: [], tokens: {} },
    aside: { role: "complementary", events: [], tokens: {} },
    "avatar-fallback": { role: "generic", events: [], tokens: {} },
    "avatar-image": { role: "img", events: [], tokens: {} },
    "avatar-root": { role: "img", events: [], tokens: {} },
    banner: { role: "banner", events: [], tokens: {} },
    blockquote: { role: "blockquote", events: [], tokens: {} },
    button: {
      role: "button",
      events: ["click"],
      tokens: { bg: "primary-500", fg: "primary-50" },
    },
    "calendar-cell": { role: "cell", events: [], tokens: {} },
    "calendar-cell-trigger": { role: "button", events: ["click"], tokens: {} },
    "calendar-grid": { role: "grid", events: [], tokens: {} },
    "calendar-grid-body": { role: "rowgroup", events: [], tokens: {} },
    "calendar-grid-head": { role: "rowgroup", events: [], tokens: {} },
    "calendar-grid-row": { role: "row", events: [], tokens: {} },
    "calendar-head-cell": { role: "columnheader", events: [], tokens: {} },
    "calendar-header": { role: "generic", events: [], tokens: {} },
    "calendar-heading": { role: "generic", events: [], tokens: {} },
    "calendar-next": { role: "button", events: ["click"], tokens: {} },
    "calendar-prev": { role: "button", events: ["click"], tokens: {} },
    "calendar-root": { role: "group", events: [], tokens: {} },
    caption: { role: "caption", events: [], tokens: {} },
    card: { role: "group", events: [], tokens: {} },
    "checkbox-root": { role: "checkbox", events: ["click"], tokens: {} },
    chip: { role: "button", events: ["click"], tokens: {} },
    code: { role: "code", events: [], tokens: {} },
    container: { role: "generic", events: [], tokens: {} },
    "date-picker-calendar": { role: "group", events: [], tokens: {} },
    "date-picker-cell": { role: "cell", events: [], tokens: {} },
    "date-picker-cell-trigger": { role: "button", events: ["click"], tokens: {} },
    "date-picker-content": { role: "dialog", events: [], tokens: {} },
    "date-picker-field": { role: "group", events: [], tokens: {} },
    "date-picker-grid": { role: "grid", events: [], tokens: {} },
    "date-picker-grid-body": { role: "rowgroup", events: [], tokens: {} },
    "date-picker-grid-head": { role: "rowgroup", events: [], tokens: {} },
    "date-picker-grid-row": { role: "row", events: [], tokens: {} },
    "date-picker-head-cell": { role: "columnheader", events: [], tokens: {} },
    "date-picker-header": { role: "generic", events: [], tokens: {} },
    "date-picker-heading": { role: "generic", events: [], tokens: {} },
    "date-picker-input": { role: "spinbutton", events: [], tokens: {} },
    "date-picker-next": { role: "button", events: ["click"], tokens: {} },
    "date-picker-prev": { role: "button", events: ["click"], tokens: {} },
    "date-picker-root": { role: "group", events: [], tokens: {} },
    "date-picker-trigger": { role: "button", events: ["click"], tokens: {} },
    "date-range-picker-calendar": { role: "group", events: [], tokens: {} },
    "date-range-picker-cell": { role: "cell", events: [], tokens: {} },
    "date-range-picker-cell-trigger": { role: "button", events: ["click"], tokens: {} },
    "date-range-picker-content": { role: "dialog", events: [], tokens: {} },
    "date-range-picker-field": { role: "group", events: [], tokens: {} },
    "date-range-picker-grid": { role: "grid", events: [], tokens: {} },
    "date-range-picker-grid-body": { role: "rowgroup", events: [], tokens: {} },
    "date-range-picker-grid-head": { role: "rowgroup", events: [], tokens: {} },
    "date-range-picker-grid-row": { role: "row", events: [], tokens: {} },
    "date-range-picker-head-cell": { role: "columnheader", events: [], tokens: {} },
    "date-range-picker-header": { role: "generic", events: [], tokens: {} },
    "date-range-picker-heading": { role: "generic", events: [], tokens: {} },
    "date-range-picker-input": { role: "spinbutton", events: [], tokens: {} },
    "date-range-picker-next": { role: "button", events: ["click"], tokens: {} },
    "date-range-picker-prev": { role: "button", events: ["click"], tokens: {} },
    "date-range-picker-root": { role: "group", events: [], tokens: {} },
    "date-range-picker-trigger": { role: "button", events: ["click"], tokens: {} },
    del: { role: "deletion", events: [], tokens: {} },
    "dialog-content": { role: "dialog", events: [], tokens: {} },
    "dialog-description": { role: "paragraph", events: [], tokens: {} },
    "dialog-overlay": { role: "generic", events: [], tokens: {} },
    "dialog-title": { role: "heading", events: [], tokens: {} },
    "dropdown-menu-content": { role: "menu", events: [], tokens: {} },
    "dropdown-menu-group": { role: "group", events: [], tokens: {} },
    "dropdown-menu-item": { role: "menuitem", events: ["click"], tokens: {} },
    "dropdown-menu-label": { role: "generic", events: [], tokens: {} },
    "dropdown-menu-separator": { role: "separator", events: [], tokens: {} },
    "dropdown-menu-trigger": { role: "button", events: ["click"], tokens: {} },
    em: { role: "emphasis", events: [], tokens: {} },
    fieldset: { role: "group", events: [], tokens: {} },
    footer: { role: "contentinfo", events: [], tokens: {} },
    form: { role: "form", events: ["submit", "reset"], tokens: {} },
    group: { role: "group", events: [], tokens: {} },
    h1: { role: "heading", events: [], tokens: {} },
    h2: { role: "heading", events: [], tokens: {} },
    h3: { role: "heading", events: [], tokens: {} },
    h4: { role: "heading", events: [], tokens: {} },
    h5: { role: "heading", events: [], tokens: {} },
    h6: { role: "heading", events: [], tokens: {} },
    header: { role: "banner", events: [], tokens: {} },
    hr: { role: "separator", events: [], tokens: {} },
    icon: { role: "img", events: [], tokens: {} },
    img: { role: "img", events: [], tokens: {} },
    input: { role: "textbox", events: ["input", "change", "focus", "blur"], tokens: {} },
    kbd: { role: "generic", events: [], tokens: {} },
    label: { role: "generic", events: [], tokens: {} },
    li: { role: "listitem", events: [], tokens: {} },
    "listbox-content": { role: "listbox", events: [], tokens: {} },
    "listbox-filter": { role: "textbox", events: [], tokens: {} },
    "listbox-group": { role: "group", events: [], tokens: {} },
    "listbox-group-label": { role: "generic", events: [], tokens: {} },
    "listbox-item": { role: "option", events: ["click"], tokens: {} },
    main: { role: "main", events: [], tokens: {} },
    nav: { role: "navigation", events: [], tokens: {} },
    ol: { role: "list", events: [], tokens: {} },
    p: { role: "paragraph", events: [], tokens: {} },
    "popover-anchor": { role: "generic", events: [], tokens: {} },
    "popover-arrow": { role: "generic", events: [], tokens: {} },
    "popover-close": { role: "button", events: ["click"], tokens: {} },
    "popover-content": { role: "dialog", events: [], tokens: {} },
    "popover-trigger": { role: "button", events: ["click"], tokens: {} },
    pre: { role: "generic", events: [], tokens: {} },
    "radio-group-indicator": { role: "generic", events: [], tokens: {} },
    "radio-group-item": { role: "radio", events: ["click"], tokens: {} },
    "radio-group-root": { role: "radiogroup", events: [], tokens: {} },
    "range-calendar-cell": { role: "cell", events: [], tokens: {} },
    "range-calendar-cell-trigger": { role: "button", events: ["click"], tokens: {} },
    "range-calendar-grid": { role: "grid", events: [], tokens: {} },
    "range-calendar-grid-body": { role: "rowgroup", events: [], tokens: {} },
    "range-calendar-grid-head": { role: "rowgroup", events: [], tokens: {} },
    "range-calendar-grid-row": { role: "row", events: [], tokens: {} },
    "range-calendar-head-cell": { role: "columnheader", events: [], tokens: {} },
    "range-calendar-header": { role: "generic", events: [], tokens: {} },
    "range-calendar-heading": { role: "generic", events: [], tokens: {} },
    "range-calendar-next": { role: "button", events: ["click"], tokens: {} },
    "range-calendar-prev": { role: "button", events: ["click"], tokens: {} },
    "range-calendar-root": { role: "group", events: [], tokens: {} },
    "scroll-area-corner": { role: "generic", events: [], tokens: {} },
    "scroll-area-root": { role: "generic", events: [], tokens: {} },
    "scroll-area-scrollbar": { role: "scrollbar", events: [], tokens: {} },
    "scroll-area-thumb": { role: "generic", events: [], tokens: {} },
    "scroll-area-viewport": { role: "generic", events: [], tokens: {} },
    section: { role: "region", events: [], tokens: {} },
    "select-content": { role: "listbox", events: [], tokens: {} },
    "select-item": { role: "option", events: ["click"], tokens: {} },
    "select-item-text": { role: "generic", events: [], tokens: {} },
    "select-trigger": { role: "combobox", events: ["click"], tokens: {} },
    span: { role: "generic", events: [], tokens: {} },
    strong: { role: "strong", events: [], tokens: {} },
    table: { role: "table", events: [], tokens: {} },
    "tabs-content": { role: "tabpanel", events: [], tokens: {} },
    "tabs-list": { role: "tablist", events: [], tokens: {} },
    "tabs-root": { role: "generic", events: [], tokens: {} },
    "tabs-trigger": { role: "tab", events: ["click"], tokens: {} },
    "tags-input-input": { role: "textbox", events: [], tokens: {} },
    "tags-input-item": { role: "generic", events: [], tokens: {} },
    "tags-input-item-delete": { role: "button", events: ["click"], tokens: {} },
    "tags-input-item-text": { role: "generic", events: [], tokens: {} },
    "tags-input-root": { role: "group", events: [], tokens: {} },
    tbody: { role: "rowgroup", events: [], tokens: {} },
    td: { role: "cell", events: [], tokens: {} },
    textarea: { role: "textbox", events: ["input", "change", "focus", "blur"], tokens: {} },
    th: { role: "columnheader", events: [], tokens: {} },
    thead: { role: "rowgroup", events: [], tokens: {} },
    "toast-close": { role: "button", events: ["click"], tokens: {} },
    "toast-description": { role: "generic", events: [], tokens: {} },
    "toast-root": { role: "status", events: [], tokens: {} },
    "toast-title": { role: "generic", events: [], tokens: {} },
    "toast-viewport": { role: "region", events: [], tokens: {} },
    "toggle-group-item": { role: "button", events: ["click"], tokens: {} },
    "toggle-group-root": { role: "group", events: [], tokens: {} },
    "tooltip-content": { role: "tooltip", events: [], tokens: {} },
    "tooltip-trigger": { role: "button", events: ["click"], tokens: {} },
    tr: { role: "row", events: [], tokens: {} },
    ul: { role: "list", events: [], tokens: {} },
  },
  compounds: {
    accordion: { events: [] },
    avatar: { events: [] },
    calendar: { events: [] },
    checkbox: { events: [] },
    command: { events: [] },
    "date-filters": { events: [] },
    "date-picker": { events: [] },
    "date-range-picker": { events: [] },
    dialog: { events: [] },
    fab: { events: ["click"] },
    facets: { events: [] },
    hero: { events: [] },
    keywords: { events: [] },
    listbox: { events: [] },
    menu: { events: [] },
    "multi-select": { events: [] },
    pagination: { events: [] },
    popover: { events: [] },
    radio: { events: [] },
    "range-calendar": { events: [] },
    scroller: { events: [] },
    "segmented-control": { events: [] },
    select: { events: [] },
    tabs: { events: [] },
    "tags-input": { events: [] },
    toast: { events: [] },
    toaster: { events: [] },
    tooltip: { events: [] },
  },
} as const satisfies ComponentConfig;
