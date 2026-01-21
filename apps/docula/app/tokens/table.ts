import { table, thead, tbody, tr, th, td } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(table.key, {
    display: "ref-display-table",
    width: "ref-full",
    "border-collapse": "ref-border-collapse",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-lg",
  }),

  createTokenDef(thead.key, {
    display: "ref-display-table-header-group",
    background: "sys-surface-container",
  }),

  createTokenDef(tbody.key, {
    display: "ref-display-table-row-group",
  }),

  createTokenDef(tr.key, {
    display: "ref-display-table-row",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),

  createTokenDef(th.key, {
    display: "ref-display-table-cell",
    text: "sys-on-surface",
    "font-weight": "ref-font-bold",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "text-align": "ref-text-align-start",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),

  createTokenDef(td.key, {
    display: "ref-display-table-cell",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),
];
