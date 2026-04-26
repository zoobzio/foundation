# alloy create

Create a new alloy component from the user's description

## Step 1 — Parse Intent

Extract from the description:
- **reka-ui primitive(s)** — which reka-ui components does this wrap?
- **Semantic purpose** — what does this component do?
- **Ore elements used** — which ore elements compose the template?
- **Props** — what does the consumer configure?
- **Model** — does it have a v-model? What type?
- **Passthrough keys** — one per rendered element
- **Slot structure** — named slots matching pt keys

## Step 2 — Validate

Before proceeding, check ALL of the following. If any fail, stop and explain why.

**Boundary check** — Is this stateless?
- `useState()`, stores, factories = belongs in **forge**, not alloy
- Generics (user types T, K) = belongs in **forge**
- `defineModel` for internal reactivity is fine — owned persistent state is not

**Overlap check** — Use `Glob` for `layers/alloy/app/components/*.vue` to list existing components.

Ask: does an existing component already serve this purpose?
- Dropdown/menu behavior → Menu
- Single select → Select
- Multi select → MultiSelect or Command
- Toggle group → SegmentedControl
- Date selection → Calendar, DatePicker, RangeCalendar, DateRangePicker
- Overlay/popup → Popover, Dialog, Tooltip
- List selection → Listbox
- Tag entry → TagsInput
- Checkbox → Checkbox
- Radio → Radio
- Tabs → Tabs
- Accordion → Accordion
- Scroll container → Scroller
- Notifications → Toast, Toaster
- Navigation button → Fab
- Faceted filter → Facets
- Keyword filter → Keywords
- Date filter → DateFilters
- Pagination → Pagination
- Hero section → Hero
- Avatar → Avatar

If there's overlap, explain which existing component covers the use case.

**reka-ui check** — Does this map to a reka-ui primitive?
- If no reka-ui primitive and it's a single-element wrapper → redirect to /ore
- If it composes multiple ore elements without reka-ui → valid alloy (like Hero)

**Name check** — Does the name conflict with HTML tags, Vue builtins, ore elements, or existing alloy components?

## Step 3 — Present Plan

Show the user what will be created using [the template](templates/create.md).
Fill in all fields. Wait for confirmation before writing any files.

## Step 4 — Execute

Only after user confirms:

1. Create `layers/alloy/app/types/{name}.ts` with full type contract
2. Create `layers/alloy/app/components/{Name}.vue` with component
3. Add `use{Name}` entry to `layers/alloy/app/composables/recipe.ts`

Follow the exact patterns from existing components. Match the style of the closest
analog. Ensure:
- Every rendered element has a pt key in the Passthrough type
- Every pt key has a usePassthrough call with Recipe local defaults
- Every pt-managed element has a named slot with v-bind="ctx"
- Model props are explicit in Props and Emits types
- No direct prop bindings — everything through pt
- No anonymous default slots
- No v-model on pt-managed elements

## Step 5 — Test

After creating the component, follow [test.md](test.md) to generate the test file.
Run the test to verify: `npx vitest run layers/alloy/tests/components/{Name}.test.ts`
