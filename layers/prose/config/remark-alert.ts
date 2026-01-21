import { visit } from "unist-util-visit";

const ALERT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n?/i;
const ALERT_TEXT_REGEX = /^!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)$/i;

export type AlertVariant = "note" | "tip" | "important" | "warning" | "caution";

interface MdastNode {
  type: string;
  name?: string;
  attributes?: Record<string, unknown>;
  children?: MdastNode[];
  value?: string;
  data?: Record<string, unknown>;
}

/**
 * Remark plugin to transform GitHub Flavored Markdown alerts into ProseAlert components.
 *
 * Transforms:
 *   > [!NOTE]
 *   > This is a note.
 *
 * Into an AST node that MDC renders as:
 *   <ProseAlert variant="note">This is a note.</ProseAlert>
 */
export function remarkAlert() {
  return (tree: MdastNode) => {
    visit(tree, "blockquote", (node: MdastNode) => {
      if (!node.children?.length) return;

      const firstChild = node.children[0];
      if (firstChild?.type !== "paragraph" || !firstChild.children?.length) return;

      const firstInline = firstChild.children[0];
      let variant: AlertVariant | null = null;

      // Case 1: remark-mdc parsed [!TIP] as a textComponent span
      if (
        firstInline?.type === "textComponent" &&
        firstInline.name === "span" &&
        firstInline.children?.[0]?.type === "text"
      ) {
        const spanText = firstInline.children[0].value;
        const match = spanText?.match(ALERT_TEXT_REGEX);
        if (match?.[1]) {
          variant = match[1].toLowerCase() as AlertVariant;
          // Remove the textComponent from the paragraph
          firstChild.children.shift();
        }
      }
      // Case 2: Plain text with [!TIP] prefix (if remark-mdc didn't process it)
      else if (firstInline?.type === "text" && firstInline.value) {
        const match = firstInline.value.match(ALERT_REGEX);
        if (match?.[1]) {
          variant = match[1].toLowerCase() as AlertVariant;
          // Remove the [!TYPE] prefix from the text
          firstInline.value = firstInline.value.replace(ALERT_REGEX, "");
          // If the text is now empty, remove it
          if (firstInline.value === "" && firstChild.children?.length === 1) {
            node.children?.shift();
          }
        }
      }

      if (!variant) return;

      // Transform to containerComponent node for MDC
      node.type = "containerComponent";
      node.name = "prose-alert";
      node.attributes = { variant };
    });
  };
}

export default remarkAlert;
