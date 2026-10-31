import { describe, expect, it } from "vitest";
import { createQueryState } from "../src/state";
import { QUERY_STATE_FIELDS } from "../src/constants";

describe("createQueryState", () => {
  it("initializes every field with its default", () => {
    expect(createQueryState()).toEqual({ entries: [], draft: "" });
  });

  it("each call returns an independent container", () => {
    const a = createQueryState();
    const b = createQueryState();
    a.entries.push({ kind: "literal", key: "text", value: "x" });
    expect(b.entries).toEqual([]);
  });

  it("QUERY_STATE_FIELDS names exactly the container's fields", () => {
    expect(Object.keys(QUERY_STATE_FIELDS).sort()).toEqual(
      Object.keys(createQueryState()).sort(),
    );
  });
});
