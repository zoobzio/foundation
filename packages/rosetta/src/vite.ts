import type { Plugin } from "vite";
import { hashText } from "./hash";
import { extractStrings, extractImports, collectFile, type FileEntry } from "./extract";
import type { SourceMap } from "./types";

const T_CALL_RE = /\$t\(\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')\s*/g;

/** Replaces $t("text") string arguments with $t("hash") in source code. */
const transformCode = (code: string): string =>
  code.replace(T_CALL_RE, (_full, dq, sq) => {
    const text = dq ?? sq;
    const hash = hashText(text);
    return `$t("${hash}"`;
  });

export interface RosettaPluginContext {
  sourceMap: SourceMap;
  fileMap: Record<string, FileEntry>;
}

export const rosettaVitePlugin = (ctx: RosettaPluginContext): Plugin => ({
  name: "rosetta",
  enforce: "pre",

  transform(code, id) {
    if (!/\.(?:vue|ts|js|tsx|jsx)(?:\?.*)?$/.test(id)) return;
    if (id.includes("node_modules")) return;

    const fileId = id.replace(/\?.*$/, "");
    const imports = extractImports(code);

    if (!code.includes("$t(")) {
      if (imports.length > 0 && !ctx.fileMap[fileId]) {
        ctx.fileMap[fileId] = { hashes: [], imports };
      }
      return;
    }

    const strings = extractStrings(code);
    if (strings.length === 0) {
      if (imports.length > 0 && !ctx.fileMap[fileId]) {
        ctx.fileMap[fileId] = { hashes: [], imports };
      }
      return;
    }

    const entry = collectFile(strings, imports, ctx.sourceMap);

    const existing = ctx.fileMap[fileId];
    if (existing) {
      for (const hash of entry.hashes) {
        if (!existing.hashes.includes(hash)) existing.hashes.push(hash);
      }
      for (const imp of entry.imports) {
        if (!existing.imports.includes(imp)) existing.imports.push(imp);
      }
    } else {
      ctx.fileMap[fileId] = entry;
    }

    return {
      code: transformCode(code),
      map: null,
    };
  },
});
