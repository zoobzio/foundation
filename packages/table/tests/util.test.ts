import { describe, expect, it } from "vitest";
import { change } from "../src/util";
import type { FakeRow } from "./data";

describe("change", () => {
  it("builds the change object of a field", () => {
    expect(change<FakeRow>("page", 1, 2)).toEqual({
      field: "page",
      before: 1,
      after: 2,
    });
  });
});
