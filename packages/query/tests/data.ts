import type { Config } from "../src/types";

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
