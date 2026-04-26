# ore update

Modify an existing ore element

## Step 1 — Resolve & Read

Find the element by name. Read both files:
- `layers/ore/app/types/{name}.ts`
- `layers/ore/app/components/{Name}.vue`

If the element doesn't exist, stop and suggest `/ore create` instead.

## Step 2 — Parse Intent

Understand what the user wants to change:
- **Adding props** — new semantic props beyond modifiers
- **Changing template** — restructuring the HTML output
- **Adding Icon composition** — embedding an Icon internally
- **Changing HTML tag** — switching the root element
- **Other** — clarify before proceeding

## Step 3 — Validate

**Boundary check** — Does the change introduce JS behavior?
- Adding @click, v-model, computed, watch = belongs in alloy, not here
- If the user is trying to add behavior, explain why and redirect to `/alloy`

**Prop check** — Are new props declarative?
- No callbacks (onClick, onClose, etc.)
- No interaction state (open, active, selected, etc.)
- Semantic HTML concerns only (label, disabled, type, src, alt, etc.)

**Icon check** — If adding Icon composition:
- Must be purely presentational
- No click handlers on the Icon
- Reference existing patterns: Alert, Banner, Caption, Chip

**Downstream impact** — If changing the HTML tag or removing props:
- Search for usages in alloy/forge/foundry/example
- Report any components that depend on the current structure
- Flag breaking changes

## Step 4 — Present Plan

Show the user what will change using [the template](templates/update.md).
Include before/after for modified sections. Wait for confirmation.

## Step 5 — Execute

Only after user confirms, apply the changes to the type file and component file.

## Step 6 — Test

After updating the element, follow [test.md](test.md) to update the test file.
Add tests for new props, remove tests for removed props, update assertions for changed behavior.
Run the test to verify: `npx vitest run layers/ore/tests/components/{Name}.test.ts`
