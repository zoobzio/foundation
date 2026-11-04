import type { Config, Literal } from "../src/types";
import { QUERY_TEXT_LITERAL } from "../src/constants";

export const fakeConfig: Config = {
  fields: {
    id: {
      label: "ID",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    },
    name: { label: "Name" },
    status: { label: "Status", values: ["Active", "Inactive", "Pending"] },
    created: {
      label: "Created",
      operators: ["before", "after", "on"],
      defaultOperator: "on",
    },
    amount: { label: "Amount", operators: ["over", "under", "is"] },
  },
};

/** A literal with its own characters. */
export const TAG: Literal = { label: "Tag", open: "(", close: ")" };

/** A literal whose `open` extends the tag's. */
export const NEST: Literal = { label: "Nest", open: "((", close: "))" };

/** The text literal beside the two above. */
export const TWO: Record<string, Literal> = {
  text: QUERY_TEXT_LITERAL,
  tag: TAG,
  nest: NEST,
};
