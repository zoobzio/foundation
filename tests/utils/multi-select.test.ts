import { describe, it, expect } from "vitest";
import { MultiSelect } from "#foundation/utils/multi-select";
const { display, toggle } = MultiSelect;

const items = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("display", () => {
  it("returns placeholder when nothing selected", () => {
    expect(display(items, [], "Pick one")).toBe("Pick one");
  });

  it("returns item label when one selected", () => {
    expect(display(items, ["banana"], "Pick one")).toBe("Banana");
  });

  it("falls back to value when item not found", () => {
    expect(display(items, ["unknown"], "Pick one")).toBe("unknown");
  });

  it("returns count string when multiple selected", () => {
    expect(display(items, ["apple", "cherry"], "Pick one")).toBe("2 selected");
  });
});

describe("toggle", () => {
  it("adds value when not present", () => {
    expect(toggle(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes value when present", () => {
    expect(toggle(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("returns new array (immutable)", () => {
    const original = ["a", "b"];
    const result = toggle(original, "c");
    expect(result).not.toBe(original);
  });
});
