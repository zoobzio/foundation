import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";

export const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--shiki-keyword)" },
  { tag: tags.comment, color: "var(--shiki-comment)", fontStyle: "italic" },
  { tag: tags.string, color: "var(--shiki-string)" },
  { tag: tags.number, color: "var(--shiki-number)" },
  { tag: tags.bool, color: "var(--shiki-keyword)" },
  { tag: tags.null, color: "var(--shiki-keyword)" },
  { tag: tags.function(tags.variableName), color: "var(--shiki-function)" },
  { tag: tags.typeName, color: "var(--shiki-type)" },
  { tag: tags.className, color: "var(--shiki-type)" },
  { tag: tags.definition(tags.variableName), color: "var(--shiki-variable)" },
  { tag: tags.variableName, color: "var(--shiki-variable)" },
  { tag: tags.propertyName, color: "var(--shiki-property)" },
  { tag: tags.operator, color: "var(--shiki-operator)" },
  { tag: tags.punctuation, color: "var(--shiki-punctuation)" },
  { tag: tags.bracket, color: "var(--shiki-punctuation)" },
  { tag: tags.tagName, color: "var(--shiki-tag)" },
  { tag: tags.attributeName, color: "var(--shiki-parameter)" },
  { tag: tags.regexp, color: "var(--shiki-regex)" },
  { tag: tags.escape, color: "var(--shiki-regex-constant)" },
  { tag: tags.heading, color: "var(--shiki-header)", fontWeight: "bold" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
]);

export const baseTheme = EditorView.theme({
  "&": {
    color: "var(--shiki-text)",
    backgroundColor: "transparent",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "none",
    color: "var(--shiki-comment)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--shiki-text)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "var(--shiki-comment) !important",
    opacity: "0.2",
  },
  ".cm-foldGutter .cm-gutterElement": {
    color: "var(--shiki-comment)",
  },
});

export const codeViewTheme = [
  baseTheme,
  syntaxHighlighting(highlightStyle),
];
