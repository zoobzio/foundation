import { babelParse, parse as parseSfc } from "@vue/compiler-sfc";

import type { FileFacts, ImportRef, RenderRef } from "./types.js";

/**
 * Minimal structural view of the Babel statements we read. Babel's own types
 * aren't a direct dependency, and we only touch this handful of fields.
 */
interface Stmt {
  type: string;
  loc?: { start: { line: number } } | null;
  source?: { value: string } | null;
  importKind?: string;
  exportKind?: string;
  specifiers?: {
    type: string;
    local?: { name: string };
    exported?: { name?: string; value?: string };
  }[];
  declaration?: {
    type: string;
    id?: { name?: string } | null;
    declarations?: { id: { type: string; name?: string } }[];
  } | null;
}

function exportedName(spec: {
  exported?: { name?: string; value?: string };
}): string | null {
  return spec.exported?.name ?? spec.exported?.value ?? null;
}

/**
 * Collect import/export facts from a TS/JS module body. `lineOffset` shifts
 * reported lines when the code is an SFC block (block-relative → file-relative).
 */
function moduleFacts(
  code: string,
  lineOffset: number,
): Pick<FileFacts, "imports" | "exports"> {
  const ast = babelParse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });
  const imports: ImportRef[] = [];
  const exports: string[] = [];
  for (const node of ast.program.body as Stmt[]) {
    const line = (node.loc?.start.line ?? 1) + lineOffset;
    if (node.type === "ImportDeclaration" && node.source) {
      imports.push({
        specifier: node.source.value,
        line,
        kind: node.importKind === "type" ? "type" : "import",
        locals: (node.specifiers ?? [])
          .map((s) => s.local?.name)
          .filter((n): n is string => n !== undefined),
      });
      continue;
    }
    // Re-exports are dependency edges too.
    if (node.type === "ExportNamedDeclaration") {
      if (node.source) {
        imports.push({
          specifier: node.source.value,
          line,
          kind: node.exportKind === "type" ? "type" : "import",
          locals: [],
        });
      }
      for (const spec of node.specifiers ?? []) {
        const name = exportedName(spec);
        if (name) exports.push(name);
      }
      const decl = node.declaration;
      if (decl) {
        if (decl.id?.name) exports.push(decl.id.name);
        for (const d of decl.declarations ?? []) {
          if (d.id.name) exports.push(d.id.name);
        }
      }
      continue;
    }
    if (node.type === "ExportDefaultDeclaration") {
      exports.push("default");
      continue;
    }
    if (node.type === "ExportAllDeclaration" && node.source) {
      imports.push({
        specifier: node.source.value,
        line,
        kind: "import",
        locals: [],
      });
      exports.push(`* from ${node.source.value}`);
    }
  }
  return { imports, exports };
}

function pascalize(tag: string): string {
  const camel = tag.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/** Template AST element node — the two fields we use. */
interface TemplateNode {
  type: number;
  tag?: string;
  loc?: { start: { line: number } };
  children?: TemplateNode[];
}

function walkTemplate(node: TemplateNode, visit: (el: TemplateNode) => void) {
  if (node.type === 1) visit(node);
  for (const child of node.children ?? []) walkTemplate(child, visit);
}

function vueFacts(path: string, source: string): FileFacts {
  const { descriptor, errors } = parseSfc(source, { filename: path });
  if (errors.length > 0) {
    throw new Error(`${path}: ${errors[0]!.message}`);
  }
  const imports: ImportRef[] = [];
  const exports: string[] = ["default"];
  for (const block of [descriptor.script, descriptor.scriptSetup]) {
    if (!block) continue;
    const facts = moduleFacts(block.content, block.loc.start.line - 1);
    imports.push(...facts.imports);
  }

  const renders: RenderRef[] = [];
  const ast = descriptor.template?.ast;
  if (ast) {
    // Tag → specifier of the import that binds it (Vue matches kebab-case
    // tags to PascalCase locals, so compare pascalized).
    const byLocal = new Map<string, string>();
    for (const imp of imports) {
      for (const local of imp.locals) byLocal.set(local, imp.specifier);
    }
    walkTemplate(ast as unknown as TemplateNode, (el) => {
      if (!el.tag) return;
      const specifier = byLocal.get(el.tag) ?? byLocal.get(pascalize(el.tag));
      if (specifier !== undefined) {
        renders.push({ specifier, tag: el.tag, line: el.loc?.start.line ?? 1 });
      }
    });
  }
  return { imports, exports, renders };
}

/**
 * Extract the module facts of one source file. Throws with the file path in
 * the message on a parse failure — callers record it as a diagnostic.
 */
export function parseFile(path: string, source: string): FileFacts {
  if (path.endsWith(".vue")) return vueFacts(path, source);
  try {
    return { ...moduleFacts(source, 0), renders: [] };
  } catch (error) {
    throw new Error(
      `${path}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}
