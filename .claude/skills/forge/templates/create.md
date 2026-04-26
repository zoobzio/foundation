## New Widget: {Widget}

| Field | Value |
|-------|-------|
| **Semantic purpose** | {description} |
| **Generics** | `<T, K = unknown>` — {what T and K represent} |
| **Fetch** | {yes/no — async data source} |
| **Persistence** | {yes/no — snapshot/restore} |

### State Interface

| Field | Type | Category | Notes |
|-------|------|----------|-------|
| {field} | `Ref<{type}>` | state | {notes} |
| {field} | `ComputedRef<{type}>` | getter | {notes} |
| {field} | `({args}) => {return}` | action | {notes} |

### Config

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| {field} | `{type}` | {yes/no} | {notes} |

### Sub-Components

| Component | File | Role |
|-----------|------|------|
| Widget | `{Widget}/Widget.vue` | Root orchestrator |
| {Part} | `{Widget}/{Part}.vue` | {role} |

### Passthrough — Widget (root)

| Key | Element | Type |
|-----|---------|------|
| root | {Element} | {ore/alloy} |
| {key} | {Element} | {ore/alloy} |
| {part} | `{Widget}{Part}Passthrough` | sub-component |

### Passthrough — {Part}

| Key | Element | Type |
|-----|---------|------|
| {key} | {Element} | {ore/alloy} |

### Named Slots

| Slot | Level | Context | Wraps |
|------|-------|---------|-------|
| {slot} | Widget | `ctx` | {element description} |
| {slot} | {Part} | `ctx` | {element description} |

### Schema Defaults

| Field | Default |
|-------|---------|
| {field} | `{value}` |

### Files to create

- `layers/forge/app/types/{widget}.ts` — shared types
- `layers/forge/app/types/{widget}-widget.ts` — root component types
- `layers/forge/app/types/{widget}-{part}.ts` — per sub-component
- `layers/forge/app/schemas/{widget}.ts` — zod schema
- `layers/forge/app/factories/{widget}.ts` — factory
- `layers/forge/app/components/{Widget}/Widget.vue` — root component
- `layers/forge/app/components/{Widget}/{Part}.vue` — sub-components

### Closest analog

DataTable — {why it's similar, what patterns to follow}

Confirm to proceed?
