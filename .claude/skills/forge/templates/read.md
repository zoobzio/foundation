## Widget: {Widget}

| Field | Value |
|-------|-------|
| **Semantic purpose** | {description} |
| **Generics** | `<T, K = unknown>` — {what T and K represent} |
| **Factory** | `layers/forge/app/factories/{widget}.ts` |
| **Schema** | `layers/forge/app/schemas/{widget}.ts` |
| **Types** | `layers/forge/app/types/{widget}.ts` |

### State Interface

| Field | Type | Category |
|-------|------|----------|
| {field} | `{type}` | {state/getter/action} |

### Config

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| {field} | `{type}` | {yes/no} | {notes} |

### Sub-Components

| Component | File | Type File | Role |
|-----------|------|-----------|------|
| Widget | `{Widget}/Widget.vue` | `{widget}-widget.ts` | Root orchestrator |
| {Part} | `{Widget}/{Part}.vue` | `{widget}-{part}.ts` | {role} |

### Passthrough Keys — Widget (root)

| Key | Element | Type |
|-----|---------|------|
| {key} | {Element} | {ore/alloy} |

### Passthrough Keys — {Part}

| Key | Element | Type |
|-----|---------|------|
| {key} | {Element} | {ore/alloy} |

### Named Slots

| Slot | Level | Context | Wraps |
|------|-------|---------|-------|
| {slot} | {component} | {context fields} | {element description} |

### Usage

| Location | Files |
|----------|-------|
| Foundry | {foundry workspaces using this widget} |
| Apps | {apps using this widget} |
