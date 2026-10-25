import type { EditorTool } from "../types/components/editor";
import type { Service } from "@zoobzio/editor";

import {
  EDITOR_BLOCKQUOTE_LABEL,
  EDITOR_BULLET_LIST_LABEL,
  EDITOR_CODE_BLOCK_LABEL,
  EDITOR_HEADING_LABEL,
  EDITOR_HEADING_LEVELS,
  EDITOR_MARKS,
  EDITOR_ORDERED_LIST_LABEL,
  EDITOR_REDO_LABEL,
  EDITOR_RULE_LABEL,
  EDITOR_UNDO_LABEL,
} from "../constants/editor";

/**
 * The toolbar of a service: one tool per mark and node its schema holds,
 * in a fixed order, then undo and redo when history is on. Reads the
 * service's `active`, so a computed over it follows the selection; a
 * heading level asks the service, inside that same read.
 */
export const editorTools = <I, O>(service: Service<I, O>): EditorTool[] => {
  const { marks, nodes } = service.context.schema;
  const active = service.active;
  const tools: EditorTool[] = [];
  const tool = (
    key: string,
    label: string,
    on: boolean,
    run: () => unknown,
  ): void => {
    tools.push({ key, label, active: on, disabled: false, run: () => run() });
  };

  for (const [name, label] of EDITOR_MARKS) {
    if (!marks[name]) continue;
    tool(name, label, active[name] ?? false, () => service.toggle(name));
  }
  if (nodes.heading) {
    const levels =
      service.config.headings === false
        ? []
        : (service.config.headings ?? EDITOR_HEADING_LEVELS);
    for (const level of levels) {
      tool(
        `heading-${level}`,
        `${EDITOR_HEADING_LABEL}${level}`,
        service.isActive("heading", { level }),
        () => service.block("heading", { level }),
      );
    }
  }
  if (nodes.bulletList) {
    tool(
      "bulletList",
      EDITOR_BULLET_LIST_LABEL,
      active.bulletList ?? false,
      () => service.list("bulletList"),
    );
  }
  if (nodes.orderedList) {
    tool(
      "orderedList",
      EDITOR_ORDERED_LIST_LABEL,
      active.orderedList ?? false,
      () => service.list("orderedList"),
    );
  }
  if (nodes.blockquote) {
    tool(
      "blockquote",
      EDITOR_BLOCKQUOTE_LABEL,
      active.blockquote ?? false,
      () => service.wrap("blockquote"),
    );
  }
  if (nodes.codeBlock) {
    tool("codeBlock", EDITOR_CODE_BLOCK_LABEL, active.codeBlock ?? false, () =>
      service.block("codeBlock"),
    );
  }
  if (nodes.horizontalRule) {
    tool("horizontalRule", EDITOR_RULE_LABEL, false, () =>
      service.insert({ type: "horizontalRule" }),
    );
  }
  if (service.config.history !== false) {
    tool("undo", EDITOR_UNDO_LABEL, false, () => service.undo());
    tool("redo", EDITOR_REDO_LABEL, false, () => service.redo());
  }
  return tools;
};
