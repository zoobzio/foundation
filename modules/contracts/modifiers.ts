import type { ModifiersInput } from "./types";

import components from "../../config/components";
import { keys, entries } from "objectively";

const INDENT = "  ";

/**
 * Render the `ComponentModifiers` registry from the resolved schema.
 *
 * Every supported component is emitted as a key. Components present in the
 * schema map to an object of `axis: readonly [...values]` tuples (so the axis
 * options can be extracted with `[number]`); components the user did not
 * configure map to `never`.
 */
export const generateModifierTypes = (schema: ModifiersInput): string => {
  const elements = keys(components.elements).map((component) => {
    const axes = schema[component];

    if (!axes || keys(axes).length === 0) {
      return `${INDENT}${JSON.stringify(component)}: never;`;
    }

    const body = entries(axes)
      .map(([axis, values]) => {
        const tuple = values.map((value) => JSON.stringify(value)).join(", ");
        return `${INDENT}${INDENT}${axis}: readonly [${tuple}];`;
      })
      .join("\n");

    return `${INDENT}${JSON.stringify(component)}: {\n${body}\n${INDENT}};`;
  });

  return [
    "export interface ComponentModifiers {",
    ...elements,
    "}",
    "",
  ].join("\n");
};
