<script setup lang="ts">
import type { TreeNode } from "@zoobzio/foundation/types/core/tree";
import type { AssetFile, AssetFolder } from "#shared/assets";

import { ref } from "vue";
import Tree from "@zoobzio/foundation/components/core/tree.vue";
import { useBrowser } from "@zoobzio/foundation/factories/browser";
import { ASSETS_BROWSER } from "~/definitions/assets";
import {
  ASSET_ROOT,
  assetTrail,
  listAssets,
  removeAssetFiles,
} from "#shared/assets";

const browser = useBrowser("assets", ASSETS_BROWSER, {
  fetch: listAssets,
  actions: {
    download: (row) => {
      console.info("[example] download asset", row.name);
    },
    remove: async (row) => {
      removeAssetFiles(new Set([row.id]));
      await browser.service.fetch();
    },
  },
  folderActions: {
    rename: (folder) => {
      console.info("[example] rename folder", folder.label);
    },
  },
  bulkActions: {
    removeSelected: async (selected) => {
      removeAssetFiles(selected);
      browser.service.clearSelection();
      await browser.service.fetch();
    },
  },
});

// The full hierarchy as a nav tree — folders hold their content: subfolder
// branches first, then file leaves. The same shape a docs sidebar would
// build from nested articles (file leaves would carry `link` there).
const fileLeaf = (file: AssetFile): TreeNode => ({
  key: file.id,
  label: file.name,
  icon: "file",
});

const toTreeNode = (folder: AssetFolder): TreeNode => ({
  key: folder.key,
  label: folder.label,
  icon: "folder",
  children: [...folder.folders.map(toTreeNode), ...folder.files.map(fileLeaf)],
});

const treeItems = [
  ...ASSET_ROOT.folders.map(toTreeNode),
  ...ASSET_ROOT.files.map(fileLeaf),
];

const branchKeys = (nodes: TreeNode[]): string[] =>
  nodes.flatMap((n) =>
    n.children ? [n.key, ...branchKeys(n.children)] : [],
  );

const selectedNode = ref<TreeNode>();
const expanded = ref<string[]>(branchKeys(treeItems));

// Jumps the browser to the selected node by replaying the trail through
// the public surface: back to the root, then one `open` per level. A file
// leaf resolves to its containing folder. The in-memory backend resolves
// fetches in call order; against a real API you would navigate level by
// level (or link tree nodes) instead.
const onTreeSelect = (node: TreeNode) => {
  const trail = assetTrail(node.key);
  if (!trail) return;
  browser.service.navigate(0);
  for (const crumb of trail) browser.service.open(crumb);
};
</script>

<template>
  <section>
    <h1 class="page-title">Assets</h1>
    <p class="page-lead">
      A file browser over nested upload folders: the tree mirrors the folder
      hierarchy, the browser shows folders alphabetically above a sortable
      file table, and the breadcrumb walks back up the trail.
    </p>
    <div class="assets-layout">
      <aside class="assets-tree">
        <h2 class="assets-tree-title">Folders</h2>
        <Tree
          v-model="selectedNode"
          v-model:expanded="expanded"
          :items="treeItems"
          @select="onTreeSelect"
        />
      </aside>
      <component :is="browser.component" :service="browser.service" />
    </div>
  </section>
</template>

<style scoped>
.assets-layout {
  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  gap: var(--space-6);
  margin-top: var(--space-5);
  align-items: start;
}

.assets-tree {
  position: sticky;
  top: var(--space-6);
  padding: var(--space-3);
  background: var(--surface-container);
  border: 1px var(--stroke-solid) var(--outline-muted);
  border-radius: var(--shape-md);
}

.assets-tree-title {
  margin: 0 0 var(--space-2);
  font: var(--type-label);
  letter-spacing: var(--type-label-letter-spacing);
  color: var(--on-surface-muted);
  text-transform: uppercase;
}
</style>
