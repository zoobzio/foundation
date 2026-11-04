// The build is checked against the source messages: every key a JSON file
// under `src/messages/` declares is in the contract, nested under the
// file's name, and the source bundle formats each one.
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

type Descriptor = { defaultMessage: string; description: string };

const root = fileURLToPath(new URL("..", import.meta.url));
const dir = join(root, "src/messages");

const expectedKeys = readdirSync(dir)
  .filter((file) => file.endsWith(".json"))
  .flatMap((file) => {
    const group = basename(file, ".json");
    const source = JSON.parse(readFileSync(join(dir, file), "utf8")) as Record<
      string,
      Descriptor
    >;
    return Object.keys(source).map((name) => `${group}.${name}`);
  })
  .sort();

describe("@zoobzio/prose build", () => {
  it("lists every source key in the contract", async () => {
    const { contract, locale, locales } = await import("../.dist/index.mjs");
    expect(locale).toBe("en");
    expect(locales).toContain("en");
    expect([...contract.messages].sort()).toEqual(expectedKeys);
  });

  it("holds the source locale's bundle, one message per key", async () => {
    const { bundles } = await import("../.dist/bundles.mjs");
    const en = await bundles.en();
    expect(Object.keys(en).sort()).toEqual(expectedKeys);
  });

  it("describes every message, for the translator", () => {
    for (const file of readdirSync(dir)) {
      const source = JSON.parse(
        readFileSync(join(dir, file), "utf8"),
      ) as Record<string, Descriptor>;
      for (const [name, descriptor] of Object.entries(source)) {
        expect(descriptor.defaultMessage, `${file} ${name}`).toBeTruthy();
        expect(descriptor.description, `${file} ${name}`).toBeTruthy();
      }
    }
  });
});
