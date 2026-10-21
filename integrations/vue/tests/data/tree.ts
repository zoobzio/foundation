import type { TreeNode } from "../../src/types/core/tree";

/**
 * A tree node with a consumer field. `children` re-types to itself.
 */
export type FakeTreeNode = TreeNode & {
  slug: string;
  children?: FakeTreeNode[];
};

/**
 * Nested nodes with linked, branch, and disabled entries.
 */
export const fakeTreeNodes: FakeTreeNode[] = [
  {
    key: "guides",
    label: "Guides",
    slug: "guides",
    children: [
      {
        key: "intro",
        label: "Introduction",
        slug: "guides/intro",
        link: { to: "/guides/intro" },
      },
      {
        key: "advanced",
        label: "Advanced",
        slug: "guides/advanced",
        children: [
          {
            key: "recipes",
            label: "Recipes",
            slug: "guides/advanced/recipes",
            link: { to: "/guides/advanced/recipes" },
          },
        ],
      },
    ],
  },
  {
    key: "reference",
    label: "Reference",
    slug: "reference",
    link: { to: "/reference", target: "_blank" },
  },
  {
    key: "archive",
    label: "Archive",
    slug: "archive",
    disabled: true,
  },
];
