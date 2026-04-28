interface FakeDocument {
  title: string;
  status: string;
  language: string;
  recordCount: number;
  summary: string;
  content: string;
}

const fakeContent = JSON.stringify(
  {
    totalRecords: 50,
    departments: ["Engineering", "Marketing", "Sales", "Support"],
    statuses: ["Active", "Inactive", "Pending"],
    records: Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
      department: ["Engineering", "Marketing", "Sales", "Support"][i % 4],
    })),
  },
  null,
  2,
);

const fakeSummary = `# User Report

A summary of the user data stored in the system.

## Overview

This document contains **50 user records** spanning four departments:

- Engineering
- Marketing
- Sales
- Support

## Status Breakdown

Users are categorized into three statuses:

1. **Active** — currently engaged
2. **Inactive** — no recent activity
3. **Pending** — awaiting approval

> This data is generated for demonstration purposes and does not represent real users.
`;

export const accessFakePreview = createPreview<FakeDocument>("fake-preview", {
  fields: [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "language", label: "Language" },
    { key: "recordCount", label: "Records" },
    { key: "summary", label: "Summary", type: "markdown" },
  ],
  content: { type: "code", key: "content", language: "json" },
  fetch: async () => ({
    title: "User Report",
    status: "Active",
    language: "JSON",
    recordCount: 50,
    summary: fakeSummary,
    content: fakeContent,
  }),
});
