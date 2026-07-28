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
  it("merges channels and forward into one computed", () => {
    const bindings = useBindings<"button">(() => ({
      modifiers: { variant: "solid" },
      tokens: { "primary-500": "{primary-600}" },
      aria: { pressed: true },
      forward: {},
    }));
    expect(bindings.value).toEqual({
      "data-variant": "solid",
      style: "--primary-500: var(--primary-600)",
      "aria-pressed": true,
    });
  });

  it("includes forwarded props verbatim", () => {
    const bindings = useBindings<"button", { type?: string }>(() => ({
      modifiers: undefined,
      tokens: undefined,
      aria: undefined,
      forward: { type: "submit" },
    }));
    expect(bindings.value).toEqual({ type: "submit" });
  });

  it("omits channels that are not provided", () => {
    const bindings = useBindings<"button">(() => ({
      aria: { label: "Go" },
      forward: {},
    }));
    expect(bindings.value).toEqual({ "aria-label": "Go" });
  });

  it("tracks the source reactively", async () => {
    const { ref } = await import("vue");
    const pressed = ref(false);
    const bindings = useBindings<"button">(() => ({
      aria: { pressed: pressed.value },
      forward: {},
    }));
    expect(bindings.value["aria-pressed"]).toBe(false);
    pressed.value = true;
    expect(bindings.value["aria-pressed"]).toBe(true);
  });
});
