## Delete Component: {Name}

### Dependency Report

| Location | File | Usage |
|----------|------|-------|
| {layer} | {file path} | {how it's used — template, type import, pt reference} |

**Total dependents: {count}**

### Files to remove

- `layers/alloy/app/types/{name}.ts`
- `layers/alloy/app/components/{Name}.vue`

{If dependents > 0: "This component has active dependents. Removing it will break the files listed above. Confirm to proceed?"}
{If dependents = 0: "No dependents found. Confirm to proceed?"}
