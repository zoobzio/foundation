import { CODE_STATIC_CLASS } from "../constants/code";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};

/**
 * The text as HTML text: the three characters that mean something in
 * markup, escaped.
 */
export const escape = (text: string): string =>
  text.replace(/[&<>]/g, (char) => ESCAPES[char] ?? char);

/**
 * The static copy of a service's text: a `pre` holding the text escaped,
 * for a host to show before the editor mounts. The HTML parser drops one
 * newline at the start of a `pre`, so a text that starts with one gets
 * another, and the copy reads as the text does.
 */
export const codeMarkup = (text: string): string => {
  const lead = text.startsWith("\n") ? "\n" : "";
  return `<pre class="${CODE_STATIC_CLASS}">${lead}${escape(text)}</pre>`;
};
