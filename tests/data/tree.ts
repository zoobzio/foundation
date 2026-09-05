import type { TreeNode } from "../../app/types/core/tree";

/** Consumer node type: extends the base with an extra field and re-types
 *  children to itself, the pattern the component's generic supports. */
export type FakeTreeNode = TreeNode & {
  slug: string;
  children?: FakeTreeNode[];
};

export const fakeTreeNodes: FakeTreeNode[] = [
  {
    key: "guides",
    label: "Guides",
    icon: "folder",
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
