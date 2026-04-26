## New Component: {Name}

| Field | Value |
|-------|-------|
| **reka-ui primitives** | {list of reka-ui components used} |
| **Semantic purpose** | {description} |
| **Model** | {modelValue type or "none"} |

### Passthrough Keys

| Key | Element | Type |
|-----|---------|------|
| root | {RekaRoot} | reka |
| {key} | {Element} | {ore/reka/alloy} |

### Props

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| modelValue? | `{type}` | no | model prop |
| {prop} | `{type}` | {yes/no} | {notes} |
| pt? | `{Name}Passthrough` | no | passthrough |

### Emits

| Event | Payload | Notes |
|-------|---------|-------|
| update:modelValue | `{type}` | model update |
| {event} | `{type}` | {notes} |

### Named Slots

| Slot | Context | Wraps |
|------|---------|-------|
| {slot} | `ctx` | {element description} |

### Files to create

- `layers/alloy/app/types/{name}.ts`
- `layers/alloy/app/components/{Name}.vue`

### Closest analog

{existing component name} — {why it's similar, what pattern to follow}

Confirm to proceed?
