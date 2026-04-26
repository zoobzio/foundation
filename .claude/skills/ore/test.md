# ore test

Write or update tests for an ore element.

## Test Location

`layers/ore/tests/components/{Name}.test.ts`

## Test Pattern

Every ore element test uses vitest + @vue/test-utils with a local factory function:

```ts
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {Name} from "../../app/components/{Name}.vue";

const factory = (props = {}, slots = {}) =>
  mount({Name}, { props, slots });
```

For elements composing Icon (Alert, Banner, Caption, Chip), stub Icon:
```ts
const factory = (props = {}, slots = {}) =>
  mount({Name}, { props, slots, global: { stubs: { Icon: true } } });
```

### Required Test Cases

**1. Tag + class** — correct HTML element and `f-{name}` class
```ts
it("renders {tag} with f-{name} class", () => {
  const wrapper = mount({Name});
  expect(wrapper.element.tagName).toBe("{TAG}");
  expect(wrapper.classes()).toContain("f-{name}");
});
```

**2. Modifiers** — all 6 data-attribute bindings
```ts
it("binds modifier data attributes", () => {
  const wrapper = mount({Name}, {
    props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
  });
  expect(wrapper.attributes("data-variant")).toBe("outlined");
  expect(wrapper.attributes("data-size")).toBe("sm");
  expect(wrapper.attributes("data-color")).toBe("primary");
  expect(wrapper.attributes("data-radius")).toBe("md");
  expect(wrapper.attributes("data-density")).toBe("compact");
  expect(wrapper.attributes("data-elevation")).toBe("sm");
});
```

**3. Label + aria-label** (if element has label prop)
```ts
it("binds aria-label from label prop", () => {
  const wrapper = mount({Name}, { props: { label: "Test" } });
  expect(wrapper.attributes("aria-label")).toBe("Test");
});

it("renders label as default slot text", () => {
  const wrapper = mount({Name}, { props: { label: "Test" } });
  expect(wrapper.text()).toBe("Test");
});
```

**4. Slot content** (if element has slot)
```ts
it("renders slot content", () => {
  const wrapper = mount({Name}, { slots: { default: "Custom" } });
  expect(wrapper.text()).toBe("Custom");
});
```

**5. Element-specific props** — one test per semantic prop
- Button: type, disabled, ariaPressed, ariaExpanded, ariaHaspopup
- Input: type, placeholder, disabled, required, ariaInvalid, ariaDescribedby
- Alert/Banner: role (default + override)
- Icon: aria-hidden (default), aria-label + role="img" (when label provided)
- Anchor: disabled, ariaCurrent
- Chip: closable, ariaPressed, ariaSelected
- Th: scope
- Img: src, alt
- Label: for
- etc.

**6. Icon composition** (if element composes Icon)
```ts
it("renders Icon when icon prop is provided", () => {
  const wrapper = mount({Name}, {
    props: { icon: "warning" },
    global: { stubs: { Icon: true } },
  });
  expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
});

it("does not render Icon without icon prop", () => {
  const wrapper = mount({Name}, {
    global: { stubs: { Icon: true } },
  });
  expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
});
```

## When to stub

- Stub `Icon` when the element composes it: `global: { stubs: { Icon: true } }`
- No other stubs needed for ore elements

## After Create

When a new element is created, generate the full test file covering all applicable cases.

## After Update

When an element is modified:
- If props were added: add test cases for the new props
- If props were removed: remove the corresponding test cases
- If template changed: update tag/class/slot assertions as needed
- Run the test to verify: `npx vitest run tests/unit/layers/ore/app/components/{Name}.test.ts`

## After Delete

When an element is removed, delete its test file:
`layers/ore/tests/components/{Name}.test.ts`
