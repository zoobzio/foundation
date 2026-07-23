import { describe, it, expect } from "vitest";
import { useModifiers } from "#foundation/composables/modifiers";
import { useTokens } from "#foundation/composables/tokens";
import { useAria } from "#foundation/composables/aria";
import { useBindings } from "#foundation/composables/bindings";

describe("useModifiers", () => {
  it("returns {} when no props are given", () => {
    expect(useModifiers()).toEqual({});
  });

  it("prefixes each axis with data-", () => {
    expect(
      useModifiers<"button">({ variant: "solid", tone: "primary" }),
    ).toEqual({
      "data-variant": "solid",
      "data-tone": "primary",
    });
  });

  it("only emits the axes that are set", () => {
    expect(useModifiers<"button">({ variant: "ghost" })).toEqual({
      "data-variant": "ghost",
    });
  });
});

describe("useTokens", () => {
  it("returns {} when no props are given", () => {
    expect(useTokens()).toEqual({});
  });

  it("renders a theme override as a resolved custom property", () => {
    expect(useTokens({ "primary-500": "{primary-600}" })).toEqual({
      style: "--primary-500: var(--primary-600)",
    });
  });

  it("renders a component token as a var reference to its theme token", () => {
    expect(useTokens({ bg: "primary-500" })).toEqual({
      style: "--bg: var(--primary-500)",
    });
  });
});

describe("useAria", () => {
  it("returns {} when no props are given", () => {
    expect(useAria()).toEqual({});
  });

  it("prefixes each attribute with aria-", () => {
    expect(
      useAria<"button">({
        pressed: true,
        expanded: false,
        haspopup: "menu",
        label: "Confirm",
      }),
    ).toEqual({
      "aria-pressed": true,
      "aria-expanded": false,
      "aria-haspopup": "menu",
      "aria-label": "Confirm",
    });
  });

  it("preserves false values (aria attributes are not dropped)", () => {
    expect(useAria<"button">({ pressed: false })).toEqual({
      "aria-pressed": false,
    });
  });
});

describe("useBindings", () => {
  it("merges modifiers, tokens, and aria into one flat object", () => {
    expect(
      useBindings<"button", "button">(
        { variant: "solid" },
        { "primary-500": "{primary-600}" },
        { pressed: true },
      ),
    ).toEqual({
      "data-variant": "solid",
      style: "--primary-500: var(--primary-600)",
      "aria-pressed": true,
    });
  });

  it("omits sources that are not provided", () => {
    expect(
      useBindings<"button", "button">(undefined, undefined, { label: "Go" }),
    ).toEqual({
      "aria-label": "Go",
    });
  });

  it("returns {} when every source is absent", () => {
    expect(useBindings()).toEqual({});
  });
});
