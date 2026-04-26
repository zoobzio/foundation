## Delete Widget: {Widget}

### Dependency Report

| Location | File | Usage |
|----------|------|-------|
| {layer} | {file path} | {how it's used — factory call, template usage, type import, hook listener} |

**Total dependents: {count}**

### Files to remove

- `layers/forge/app/types/{widget}.ts`
- `layers/forge/app/types/{widget}-*.ts` ({list all})
- `layers/forge/app/factories/{widget}.ts`
- `layers/forge/app/schemas/{widget}.ts`
- `layers/forge/app/components/{Widget}/` (entire directory)
- `layers/forge/app/composables/*{widget}*.ts` (if any)
- `layers/forge/app/utils/*{widget}*.ts` (if any)
- Hook declarations in `layers/forge/app/hooks.d.ts`
- `layers/forge/tests/**/{widget}*.test.ts` (all test files)

{If dependents > 0: "This widget has active dependents. Removing it will break the files listed above. Confirm to proceed?"}
{If dependents = 0: "No dependents found. Confirm to proceed?"}
