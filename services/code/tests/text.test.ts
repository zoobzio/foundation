import { describe, expect, it } from "vitest";
import { text } from "../src/text";
import { hello } from "./data";

const context = { extensions: [] };

describe("text", () => {
  it("reads the text as given", () => {
    expect(text.read(hello, context)).toBe(hello);
  });

  it("writes the text as given", () => {
    expect(text.write(hello, context)).toBe(hello);
  });
});
