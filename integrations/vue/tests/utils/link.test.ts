import { describe, expect, it } from "vitest";
import { anchor } from "../../src/utils/link";

describe("anchor", () => {
  it("renders a plain anchor over a link target", () => {
    expect(anchor({ to: "/docs", target: "_blank" })).toEqual({
      as: "a",
      href: "/docs",
      target: "_blank",
    });
  });

  it("drops the href while disabled, keeping the anchor inert", () => {
    expect(anchor({ to: "/docs" }, true)).toEqual({
      as: "a",
      href: undefined,
      target: undefined,
    });
  });

  it("stays an anchor without a target", () => {
    expect(anchor(undefined)).toEqual({
      as: "a",
      href: undefined,
      target: undefined,
    });
  });
});
