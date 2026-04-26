## Update Widget: {Widget}

### Change Summary

{description of what's changing and why}

### Before

```
{relevant section of current type/factory/template}
```

### After

```
{proposed change}
```

### Contract Checklist

- [ ] Generics (T, K) preserved throughout
- [ ] New state uses `useState()` in factory
- [ ] New fields added to schema with `.default()` if persistent
- [ ] New rendered elements have pt keys in Passthrough type
- [ ] New pt keys have usePassthrough/passthrough() calls
- [ ] New pt-managed elements have `f-{widget}-{part}` classes
- [ ] New sub-components have their own type files
- [ ] Props types are named interfaces
- [ ] No type assertions (`as any`, `as unknown`)

### Impact

| Location | Affected Files | Breaking? |
|----------|---------------|-----------|
| {layer} | {file} | {yes/no — why} |

### Files to modify

- `layers/forge/app/types/{widget}.ts` — {what changes}
- `layers/forge/app/factories/{widget}.ts` — {what changes}
- `layers/forge/app/components/{Widget}/{Part}.vue` — {what changes}

Confirm to proceed?
