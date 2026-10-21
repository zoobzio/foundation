import { describe, expect, it } from "vitest";
import { change } from "../src/util";

type Shape = { page: number; query: string };

describe("change", () => {
  it("builds the change object of a field", () => {
    expect(change<Shape, "page">("page", 1, 2)).toEqual({
      field: "page",
      before: 1,
      after: 2,
    });
  });
});
