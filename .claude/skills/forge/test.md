# forge test

Write or update tests for a forge widget.

## Test Locations

- Factory tests: `layers/forge/tests/factories/{widget}.test.ts`
- Utility tests: `layers/forge/tests/utils/{widget-util}.test.ts`
- Component tests: `layers/forge/tests/components/{Widget}{Part}.test.ts`

## Factory Test Pattern

Factory tests verify the reactive state interface without mounting components:

```ts
import { describe, it, expect } from "vitest";
import { create{Widget} } from "../../app/factories/{widget}";

describe("create{Widget}", () => {
  describe("defaults", () => { ... });
  describe("state", () => { ... });
  describe("actions", () => { ... });
  describe("persistence", () => { ... });
});
```

### Required Describe Blocks — Factory

**1. defaults** — schema defaults applied correctly
```ts
describe("defaults", () => {
  it("initializes with schema defaults", () => {
    const use{Widget} = create{Widget}("test", config);
    const widget = use{Widget}();
    expect(widget.page.value).toBe(1);
    expect(widget.pageSize.value).toBe(25);
  });
});
```

**2. state** — reactive state works correctly
```ts
describe("state", () => {
  it("tracks reactive changes", () => {
    const widget = use{Widget}();
    widget.page.value = 3;
    expect(widget.page.value).toBe(3);
  });
});
```

**3. actions** — methods produce correct state changes
```ts
describe("actions", () => {
  it("goToPage updates page", () => {
    const widget = use{Widget}();
    widget.goToPage(2);
    expect(widget.page.value).toBe(2);
  });
});
```

**4. persistence** — snapshot/restore round-trips
```ts
describe("persistence", () => {
  it("round-trips through snapshot", () => {
    const widget = use{Widget}();
    widget.page.value = 5;
    const snap = widget.getSnapshot();
    widget.page.value = 1;
    widget.restoreSnapshot(snap);
    expect(widget.page.value).toBe(5);
  });
});
```

## Utility Test Pattern

Pure function tests for utils:

```ts
import { describe, it, expect } from "vitest";
import { parseShorthand } from "../../app/utils/parse-shorthand";

describe("parseShorthand", () => {
  it("parses enum shorthand", () => {
    const result = parseShorthand("status=active", columns);
    expect(result?.filter.field).toBe("status");
  });
});
```

## Component Test Pattern

Component tests verify rendering and passthrough integration.
These follow the alloy test pattern with modifications for generics:

```ts
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {Widget}Widget from "../../app/components/{Widget}/Widget.vue";

describe("{Widget}Widget", () => {
  describe("static", () => { ... });
  describe("passthrough", () => { ... });
  describe("slots", () => { ... });
});
```

Component tests require a mock state interface matching `{Widget}<T, K>`.

## When to Test What

- **Factory changes** → factory tests (state, actions, persistence)
- **New utils** → utility tests (pure functions, edge cases)
- **Template/pt changes** → component tests (rendering, passthrough merging, slots)
- **Schema changes** → factory default tests

## After Create

When a new widget is created:
1. Generate factory tests covering all 4 describe blocks
2. Generate utility tests for any pure functions
3. Generate component tests for the root Widget.vue at minimum
4. Run: `npx vitest run layers/forge/tests/`

## After Update

When a widget is modified:
- New state fields: add factory state + default tests
- New actions: add factory action tests
- New utils: add utility tests
- New pt keys: add component passthrough tests
- New slots: add component slot tests
- Run: `npx vitest run layers/forge/tests/`

## After Delete

When a widget is removed:
1. Delete all test files in `layers/forge/tests/` related to the widget
