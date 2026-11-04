import { describe, expect, it } from "vitest";
import { json } from "../src/json";
import { context, document } from "./codec";

describe("json", () => {
  it("reads the document as given", () => {
    expect(json.read(document, context())).toBe(document);
  });

  it("writes the document as given", () => {
    expect(json.write(document, context())).toBe(document);
  });
});
