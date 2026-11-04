// The text utilities: a message of the contract formats through the app's
// service, any other string stands, and the texts of a value resolve at
// every depth without writing the value given.
import { describe, expect, it } from "vitest";
import { $prosary } from "#test/mocks/app";
import { resolveText, resolveTexts } from "../../../app/utils/text";

describe("resolveText", () => {
  it("formats a key of the contract in the active locale", () => {
    expect(resolveText($prosary, "table.empty")).toBe("No data");
  });

  it("formats a key with its values", () => {
    expect(
      resolveText($prosary, [
        "pagination.info",
        { page: 2, count: 5, total: 50 },
      ]),
    ).toBe("Page 2 of 5 (50 results)");
  });

  it("keeps a string the contract does not declare", () => {
    expect(resolveText($prosary, "Name")).toBe("Name");
    expect(resolveText($prosary, "")).toBe("");
  });
});

describe("resolveTexts", () => {
  it("resolves the text keys of plain objects at every depth", () => {
    const now = new Date();
    const run = () => {};
    const nodes = [
      {
        key: "a",
        label: "table.columns",
        description: "table.empty",
        value: "table.empty",
        at: now,
        run,
        children: [{ key: "b", label: ["pagination.size", { size: 5 }] }],
      },
    ];
    const resolved = resolveTexts($prosary, nodes);
    expect(resolved).toEqual([
      {
        key: "a",
        label: "Columns",
        description: "No data",
        value: "table.empty",
        at: now,
        run,
        children: [{ key: "b", label: "Show 5" }],
      },
    ]);
    expect(resolved[0]!.at).toBe(now);
    expect(resolved[0]!.run).toBe(run);
    expect(nodes[0]!.label).toBe("table.columns");
    expect(nodes[0]!.children[0]!.label).toEqual([
      "pagination.size",
      { size: 5 },
    ]);
  });

  it("passes anything that is not data through", () => {
    expect(resolveTexts($prosary, undefined)).toBeUndefined();
    expect(resolveTexts($prosary, 3)).toBe(3);
    expect(resolveTexts($prosary, "table.empty")).toBe("table.empty");
    class Thing {
      label = "table.empty";
    }
    const thing = new Thing();
    expect(resolveTexts($prosary, thing)).toBe(thing);
  });
});
