import { describe, expect, it } from "vitest";
import { change } from "../src/util";
import type { FakeRow } from "./data";

describe("change", () => {
  it("builds the change object of a field", () => {
    expect(change<FakeRow>("loading", false, true)).toEqual({
      field: "loading",
      before: false,
      after: true,
    });
  });
});
