## Update Component: {Name}

### Change Summary

{description of what's changing and why}

### Before

```
{relevant section of current type/template}
```

### After

```
{proposed change}
```

### Contract Checklist

- [ ] Every new element has a pt key in Passthrough type
- [ ] Every new pt key has a usePassthrough call with Recipe defaults
- [ ] Every new pt-managed element has a named slot with ctx
- [ ] New model props explicit in Props AND Emits
- [ ] No direct bindings alongside v-bind="PT.props"
- [ ] No anonymous default slots

### Impact

| Location | Affected Files | Breaking? |
|----------|---------------|-----------|
| {layer} | {file} | {yes/no — why} |

### Files to modify

- `layers/alloy/app/types/{name}.ts` — {what changes}
- `layers/alloy/app/components/{Name}.vue` — {what changes}

Confirm to proceed?
