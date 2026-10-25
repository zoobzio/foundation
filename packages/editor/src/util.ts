import type { Active, Config } from "./types";
import type { Editor } from "@tiptap/core";
import type { StarterKitOptions } from "@tiptap/starter-kit";

/**
 * The feature set as StarterKit options: a feature that is off removes its
 * extensions; one that is on, or unset, keeps the defaults. `headings`
 * narrows the levels when it lists them.
 */
export const features = (config: Config): Partial<StarterKitOptions> => {
  const off = (flag: boolean | undefined): false | undefined =>
    flag === false ? false : undefined;
  const lists = off(config.lists);
  const code = off(config.code);
  return {
    heading:
      config.headings === false
        ? false
        : config.headings === undefined
          ? undefined
          : { levels: config.headings },
    bulletList: lists,
    orderedList: lists,
    listItem: lists,
    listKeymap: lists,
    link: off(config.links),
    code,
    codeBlock: code,
    blockquote: off(config.blockquote),
    horizontalRule: off(config.rule),
    undoRedo: off(config.history),
  };
};

/**
 * Which marks and nodes are active at the editor's selection, by name,
 * over every mark and node of its schema.
 */
export const snapshot = (editor: Editor): Active => {
  const active: Active = {};
  for (const name of Object.keys(editor.schema.marks)) {
    active[name] = editor.isActive(name);
  }
  for (const name of Object.keys(editor.schema.nodes)) {
    active[name] = editor.isActive(name);
  }
  return active;
};

/**
 * Whether two snapshots agree on every name.
 */
export const same = (a: Active, b: Active): boolean => {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => a[key] === b[key]);
};
