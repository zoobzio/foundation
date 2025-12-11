<script lang="ts">
import type { PageCollections } from "@nuxt/content";

export interface ContentTreeProps {
  collection: keyof PageCollections;
  title?: string;
  icon?: IconAlias;
  tokens?: Tokens<
    | "caption"
    | "tree-root"
    | "tree-branch"
    | "tree-branch-content"
    | "tree-leaf"
    | "tree-leaf-content"
  >;
}
</script>

<script setup lang="ts">
const {
  collection,
  title,
  icon,
  tokens,
} = defineProps<ContentTreeProps>();

const _styles = useTokenStyle(tokens);

const { data: navigation } = await useAsyncData(
  `content-tree-${collection}`,
  () => queryCollectionNavigation(collection),
);

// Transform ContentNavigationItem[] to TreeNode[]
const transformNavigation = (
  items: Awaited<ReturnType<typeof queryCollectionNavigation>> | null,
): TreeNode[] => {
  if (!items) return [];

  return items.map((item) => ({
    value: item.path,
    label: item.title,
    to: item.path,
    children: item.children ? transformNavigation(item.children) : undefined,
  }));
};

const treeItems = computed(() => transformNavigation(navigation.value ?? null));

const route = useRoute();

// Recursively find tree node by path
const findNodeByPath = (items: TreeNode[], path: string): TreeNode | null => {
  for (const item of items) {
    if (item.to === path) return item;
    if (item.children) {
      const found = findNodeByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
};

const selectedValue = computed(() => {
  const currentPath = route.path;
  return findNodeByPath(treeItems.value, currentPath);
});

// Use persisted tree state
const { expanded, handleExpandedUpdate } = useContentTreeState(collection);
</script>

<template>
  <Caption v-if="title" :icon="icon" :tokens="tokens">
    {{ title }}
  </Caption>
  <Tree
    :items="treeItems"
    :tokens="tokens"
    :model-value="selectedValue"
    :expanded="expanded"
    :multiple="false"
    selection-behavior="replace"
    @update:expanded="handleExpandedUpdate"
  />
</template>
