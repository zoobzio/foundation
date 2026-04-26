# alloy read

Find the right alloy component for a use case

## Step 1 — Understand Intent

Parse what the user is looking for. They may describe:
- A UI pattern ("I need a dropdown with search")
- A reka-ui primitive ("something that wraps PopoverRoot")
- A specific component by name ("show me Select")
- A behavior ("filterable multi-select with chips")

If they name a specific component, skip to Step 3.

## Step 2 — Decision Table

Match the user's intent against component categories:

| Need | Components | Key Differentiator |
|------|-----------|-------------------|
| **Selection (single)** | Select, Radio, SegmentedControl, Listbox | Select = dropdown, Radio = visible options, SegmentedControl = toggle group, Listbox = scrollable list |
| **Selection (multi)** | MultiSelect, Command, Checkbox | MultiSelect = dropdown multi, Command = searchable list with selection, Checkbox = single toggle |
| **Overlay** | Popover, Dialog, Tooltip, Menu | Popover = anchored content, Dialog = modal, Tooltip = hover hint, Menu = dropdown actions |
| **Date** | Calendar, RangeCalendar, DatePicker, DateRangePicker, DateFilters | Calendar = inline, Picker = field+popup, RangeCalendar/DateRangePicker = range selection, DateFilters = filter builder |
| **Input** | TagsInput, Keywords | TagsInput = tag entry, Keywords = include/exclude keyword builder |
| **Navigation** | Tabs, Accordion, Pagination, Fab | Tabs = panel switching, Accordion = collapsible sections, Pagination = page nav, Fab = action button |
| **Feedback** | Toast, Toaster | Toast = single notification, Toaster = notification container |
| **Layout** | Scroller, Hero | Scroller = scrollable area, Hero = landing section |
| **Display** | Avatar | Avatar = user image with fallback |

Suggest the best match and explain why. If none fit, suggest `/alloy create`.

## Step 3 — Inspect

Read the matched component's files:
- Type: `layers/alloy/app/types/{name}.ts`
- Component: `layers/alloy/app/components/{Name}.vue`

Present:
- Name, reka-ui primitives used
- All Props (including model props)
- All Emits
- Passthrough keys (every customizable element)
- Named slots (every overridable section)
- Ore elements composed

## Step 4 — Usage Context

Search for where this component is used:
- `Grep` for `<{Name}` in `layers/alloy/app/components/` (alloy-to-alloy)
- `Grep` for `<{Name}` in `layers/forge/app/components/` (forge usage)
- Show 2-3 representative usages with file paths.
