import type { Codec } from "./types";
import type { Nodes, Root } from "hast";

import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { html } from "./html";

/**
 * Drops what a parse adds beyond the tree: the position of each node, and
 * the parser's own data on the root. The HTML the tree came from was never
 * a document of the consumer's, so neither means anything.
 */
const strip = (node: Nodes): Nodes => {
  delete node.position;
  if (node.type === "root") delete node.data;
  if ("children" in node) {
    for (const child of node.children) strip(child);
  }
  return node;
};

/**
 * The document as an HTML tree, the form `hast` names: a root of elements
 * and text. The tree goes through HTML in both directions, so the mapping
 * is the extensions', as with `html`. A written tree carries no positions.
 */
export const hast: Codec<Root> = {
  read: (source, context) => html.read(toHtml(source), context),
  write: (document, context) => {
    const tree = fromHtml(html.write(document, context), { fragment: true });
    strip(tree);
    return tree;
  },
};
