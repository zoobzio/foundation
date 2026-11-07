import type {
  EditorBlock,
  EditorGroup,
  EditorTool,
  EditorToolGroup,
  EditorToolKind,
} from "../types/components/editor";
import type { Service } from "@zoobzio/editor";

import {
  EDITOR_BLOCKQUOTE_LABEL,
  EDITOR_BULLET_LIST_LABEL,
  EDITOR_CODE_BLOCK_LABEL,
  EDITOR_HEADING_LABEL,
  EDITOR_HEADING_LEVELS,
  EDITOR_MARKS,
  EDITOR_ORDERED_LIST_LABEL,
  EDITOR_PARAGRAPH_KEY,
  EDITOR_PARAGRAPH_LABEL,
  EDITOR_REDO_LABEL,
  EDITOR_RULE_LABEL,
  EDITOR_TOOL_GROUPS,
  EDITOR_UNDO_LABEL,
} from "../constants/editor";

/**
 * The toolbar of a service: one tool per mark and node its schema holds,
 * in a fixed order by group (the headings first, then the marks, the
 * lists, the blocks), then undo and redo when history is on. Reads
 * the service's `active` and `can`, so a computed over it follows the
 * selection: a tool is `active` where its mark or node is, and `disabled`
 * where its command would not apply. A heading level asks the service,
 * inside that same read.
 */
export const editorTools = <I, O>(service: Service<I, O>): EditorTool[] => {
  const { marks, nodes } = service.context.schema;
  const { active, can } = service;
  const tools: EditorTool[] = [];
  const tool = (
    key: string,
    label: string,
    kind: EditorToolKind,
    group: EditorToolGroup,
    on: boolean,
    enabled: boolean,
    run: () => unknown,
  ): void => {
    tools.push({
      key,
      label,
      kind,
      group,
      active: on,
      disabled: !enabled,
      run: () => run(),
    });
  };

  if (nodes.heading) {
    const levels =
      service.config.headings === false
        ? []
        : (service.config.headings ?? EDITOR_HEADING_LEVELS);
    for (const level of levels) {
      tool(
        `heading-${level}`,
        `${EDITOR_HEADING_LABEL}${level}`,
        "toggle",
        "headings",
        service.isActive("heading", { level }),
        can.block("heading", { level }),
        () => service.block("heading", { level }),
      );
    }
  }
  for (const [name, label] of EDITOR_MARKS) {
    if (!marks[name]) continue;
    tool(
      name,
      label,
      "toggle",
      "marks",
      active[name] ?? false,
      can.toggle(name),
      () => service.toggle(name),
    );
  }
  if (nodes.bulletList) {
    tool(
      "bulletList",
      EDITOR_BULLET_LIST_LABEL,
      "toggle",
      "lists",
      active.bulletList ?? false,
      can.list("bulletList"),
      () => service.list("bulletList"),
    );
  }
  if (nodes.orderedList) {
    tool(
      "orderedList",
      EDITOR_ORDERED_LIST_LABEL,
      "toggle",
      "lists",
      active.orderedList ?? false,
      can.list("orderedList"),
      () => service.list("orderedList"),
    );
  }
  if (nodes.blockquote) {
    tool(
      "blockquote",
      EDITOR_BLOCKQUOTE_LABEL,
      "toggle",
      "blocks",
      active.blockquote ?? false,
      can.wrap("blockquote"),
      () => service.wrap("blockquote"),
    );
  }
  if (nodes.codeBlock) {
    tool(
      "codeBlock",
      EDITOR_CODE_BLOCK_LABEL,
      "toggle",
      "blocks",
      active.codeBlock ?? false,
      can.block("codeBlock"),
      () => service.block("codeBlock"),
    );
  }
  if (nodes.horizontalRule) {
    tool(
      "horizontalRule",
      EDITOR_RULE_LABEL,
      "action",
      "blocks",
      false,
      can.insert({ type: "horizontalRule" }),
      () => service.insert({ type: "horizontalRule" }),
    );
  }
  if (service.config.history !== false) {
    tool(
      "undo",
      EDITOR_UNDO_LABEL,
      "action",
      "history",
      false,
      can.undo(),
      () => service.undo(),
    );
    tool(
      "redo",
      EDITOR_REDO_LABEL,
      "action",
      "history",
      false,
      can.redo(),
      () => service.redo(),
    );
  }
  return tools;
};

/**
 * The tools by group, in the toolbar's group order, keeping each group's
 * own order. A group with no tool is left out, so no separator stands
 * beside nothing.
 */
export const editorGroups = (tools: EditorTool[]): EditorGroup[] =>
  EDITOR_TOOL_GROUPS.map((name) => ({
    name,
    tools: tools.filter((tool) => tool.group === name),
  })).filter((group) => group.tools.length > 0);

/**
 * The block types the dropdown offers: the paragraph, then one entry per
 * heading tool, each disabled where its tool is. A toolbar with no heading
 * tool offers none.
 */
export const editorBlocks = (tools: EditorTool[]): EditorBlock[] => [
  { value: EDITOR_PARAGRAPH_KEY, label: EDITOR_PARAGRAPH_LABEL },
  ...tools
    .filter((tool) => tool.group === "headings")
    .map((tool) => ({
      value: tool.key,
      label: tool.label,
      disabled: tool.disabled,
    })),
];

/**
 * The block type at the selection: the entry of the active heading tool,
 * the paragraph otherwise.
 */
export const editorBlock = (
  tools: EditorTool[],
  blocks: EditorBlock[],
): EditorBlock => {
  const active = tools.find((tool) => tool.group === "headings" && tool.active);
  const paragraph: EditorBlock = {
    value: EDITOR_PARAGRAPH_KEY,
    label: EDITOR_PARAGRAPH_LABEL,
  };
  if (!active) return blocks[0] ?? paragraph;
  return blocks.find((block) => block.value === active.key) ?? paragraph;
};
