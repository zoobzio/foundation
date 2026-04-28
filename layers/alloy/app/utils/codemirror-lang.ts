import type { Extension } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { sql } from "@codemirror/lang-sql";
import { markdown } from "@codemirror/lang-markdown";
import { go } from "@codemirror/lang-go";

const languages: Record<string, () => Extension> = {
  json,
  javascript,
  js: javascript,
  jsx: () => javascript({ jsx: true }),
  typescript: () => javascript({ typescript: true }),
  ts: () => javascript({ typescript: true }),
  tsx: () => javascript({ jsx: true, typescript: true }),
  html,
  css,
  xml,
  svg: xml,
  yaml,
  yml: yaml,
  sql,
  markdown,
  md: markdown,
  go,
};

export const resolveLanguage = (lang: string): Extension | null => {
  const factory = languages[lang.toLowerCase()];
  return factory ? factory() : null;
};
