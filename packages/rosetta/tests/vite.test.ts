import { describe, it, expect } from "vitest";
import { hashText } from "../src/hash";
import { rosettaVitePlugin, type RosettaPluginContext } from "../src/vite";

const makeCtx = (): RosettaPluginContext => ({
  sourceMap: {},
  fileMap: {},
});

const callTransform = (code: string, id: string) => {
  const ctx = makeCtx();
  const plugin = rosettaVitePlugin(ctx);
  const transform = plugin.transform as (code: string, id: string) => { code: string; map: null } | undefined;
  const result = transform.call({} as never, code, id);
  return { result, ctx };
};

describe("rosettaVitePlugin", () => {
  it("skips files without $t calls and no imports", () => {
    const { result, ctx } = callTransform("const x = 1;", "/app/pages/index.vue");
    expect(result).toBeUndefined();
    expect(Object.keys(ctx.fileMap)).toHaveLength(0);
  });

  it("skips node_modules", () => {
    const { result } = callTransform('$t("Hello")', "/node_modules/foo/index.ts");
    expect(result).toBeUndefined();
  });

  it("skips non-script files", () => {
    const { result } = callTransform('$t("Hello")', "/app/styles.css");
    expect(result).toBeUndefined();
  });

  it("always transforms $t calls", () => {
    const { result } = callTransform('$t("Save")', "/app/pages/index.vue");
    const hash = hashText("Save");
    expect(result).toBeDefined();
    expect(result?.code).toContain(`$t("${hash}"`);
    expect(result?.code).not.toContain('"Save"');
  });

  it("extracts strings into context", () => {
    const { ctx } = callTransform('$t("Save")', "/app/pages/index.vue");
    const hash = hashText("Save");
    expect(ctx.sourceMap[hash]).toBe("Save");
    expect(ctx.fileMap["/app/pages/index.vue"].hashes).toContain(hash);
  });

  it("handles multiple $t calls in one file", () => {
    const code = 'const a = $t("Hello"); const b = $t("World");';
    const { result, ctx } = callTransform(code, "/app/pages/index.vue");
    expect(Object.keys(ctx.sourceMap)).toHaveLength(2);
    expect(result?.code).toContain(`$t("${hashText("Hello")}"`);
    expect(result?.code).toContain(`$t("${hashText("World")}"`);
  });

  it("strips query params from file IDs", () => {
    const { ctx } = callTransform('$t("Test")', "/app/pages/index.vue?type=script");
    expect(ctx.fileMap["/app/pages/index.vue"]).toBeDefined();
    expect(ctx.sourceMap[hashText("Test")]).toBe("Test");
  });

  it("records imports for files without $t calls", () => {
    const code = 'import Foo from "./Foo.vue";\nconst x = 1;';
    const { ctx } = callTransform(code, "/app/pages/index.vue");
    expect(ctx.fileMap["/app/pages/index.vue"].imports).toContain("./Foo.vue");
  });

  it("records imports alongside $t extractions", () => {
    const code = 'import Bar from "./Bar.vue";\n$t("Hello")';
    const { ctx } = callTransform(code, "/app/pages/index.vue");
    expect(ctx.fileMap["/app/pages/index.vue"].imports).toContain("./Bar.vue");
    expect(ctx.fileMap["/app/pages/index.vue"].hashes).toContain(hashText("Hello"));
  });
});
