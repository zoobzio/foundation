# alloy test

Write or update tests for an alloy component.

## Test Location

`layers/alloy/tests/components/{Name}.test.ts`

## Fixture Location

`layers/alloy/tests/fixtures/index.ts` — exports `mount{Name}()` per component

## Test Pattern

Every alloy component test uses vitest + fixtures and is organized into describe blocks:

```ts
import { describe, it, expect } from "vitest";
import { mount{Name} } from "../fixtures";

describe("{Name}", () => {
  describe("static", () => { ... });
  describe("interaction", () => { ... });
  describe("passthrough", () => { ... });
  describe("slots", () => { ... });
});
```

### Required Describe Blocks

**1. static** — default mount, verify structure
Mount once, assert against the default render:
- Root element exists with `f-{name}-root` class
- Key child elements exist with their `f-{name}-{part}` classes
- Default text/placeholder content renders
- Per-item elements render correct count

```ts
describe("static", () => {
  const wrapper = mount{Name}();

  it("renders root with f-{name}-root class", () => {
    expect(wrapper.find(".f-{name}-root").exists()).toBe(true);
  });
});
```

**2. interaction** — prop-driven behavior
Mount with specific props, verify behavior changes:
- modelValue shows selected state
- disabled prevents interaction
- Conditional elements appear/disappear based on props

```ts
describe("interaction", () => {
  it("shows selected label when modelValue matches", () => {
    const wrapper = mount{Name}({ modelValue: "banana" });
    expect(wrapper.find("span").text()).toContain("Banana");
  });
});
```

**3. passthrough** — pt merging works
Verify consumer pt overrides merge onto elements:
- At minimum test `pt.root` merging a class
- Test one nested pt key if the component has children

```ts
describe("passthrough", () => {
  it("pt.root merges onto root", () => {
    const wrapper = mount{Name}({ pt: { root: { props: { class: "custom" } } } });
    expect(wrapper.find(".f-{name}-root").classes()).toContain("custom");
  });
});
```

**4. slots** — named slot overrides
Verify each named slot replaces its default content:
- Provide a custom slot, assert it renders
- Assert the default element is gone when slot overrides

```ts
describe("slots", () => {
  it("trigger slot overrides default", () => {
    const wrapper = mount{Name}({}, { trigger: "<div class=\"custom\">Custom</div>" });
    expect(wrapper.find(".custom").exists()).toBe(true);
  });
});
```

## Fixtures

Each component has a `mount{Name}()` fixture in `layers/alloy/tests/fixtures/index.ts`.
The fixture provides:
- Correct stubs (oreStubs + rekaStubs or alloyStubs)
- Required default props (options, groups, etc.)
- The real component mounted with happy-dom

Fixtures use shared stubs from `packages/testing/helpers/stubs.ts` and
shared data from `packages/testing/data/`.

### Adding a fixture for a new component

Add to `layers/alloy/tests/fixtures/index.ts`:

For reka-ui based components:
```ts
export const mount{Name} = alloy({Name}, ["RekaRoot", "RekaChild", ...], {
  requiredProp: defaultValue,
});
```

For alloy-composed components (uses other alloy components):
```ts
export const mount{Name} = alloyComposed({Name}, {
  requiredProp: defaultValue,
});
```

## After Create

When a new component is created:
1. Add fixture to `layers/alloy/tests/fixtures/index.ts`
2. Add stub to `packages/testing/helpers/stubs.ts` alloyStubs
3. Generate test file with all 4 describe blocks
4. Run: `npx vitest run layers/alloy/tests/components/{Name}.test.ts`

## After Update

When a component is modified:
- New pt keys: add passthrough test cases
- New slots: add slot override test cases
- Changed props: update interaction tests
- Run: `npx vitest run layers/alloy/tests/components/{Name}.test.ts`

## After Delete

1. Delete `layers/alloy/tests/components/{Name}.test.ts`
2. Remove fixture from `layers/alloy/tests/fixtures/index.ts`
3. Remove stub from `packages/testing/helpers/stubs.ts` alloyStubs
