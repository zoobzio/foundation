import type { Codec } from "./types";

import { generateHTML, generateJSON } from "@tiptap/html";

/**
 * The document as an HTML string. The editor's extensions do the mapping:
 * each node and mark parses and renders by its own rules, so a consumer's
 * extension maps because the consumer registered it. `@tiptap/html`
 * resolves to a browser build or a server build by export condition, so
 * one import serves both.
 */
export const html: Codec<string> = {
  read: (source, { extensions }) => generateJSON(source, extensions),
  write: (document, { extensions }) => generateHTML(document, extensions),
};
