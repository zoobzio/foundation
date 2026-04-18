<script lang="ts">
import type { PageCollections, ContentNavigationItem } from "@nuxt/content";

export interface ContentTableProps {
  /** Collection to query navigation from (only needed at root level) */
  collection?: keyof PageCollections;
  /** Optional version prefix to filter content (e.g., "v1.0.0") */
  versionPrefix?: string;
  /** Pre-resolved nodes for recursive rendering */
  nodes?: ContentNavigationItem[];
  /** Current heading depth — maps to H3, H4, H5, etc. */
  headingDepth?: number;
}
</script>

<script setup lang="ts">
const { collection, versionPrefix, nodes, headingDepth = 3 } = defineProps<ContentTableProps>();

const appConfig = useAppConfig();
const navIcons = computed(() => appConfig.collection?.navIcons ?? {});

const { data: navigation } = collection
  ? await useAsyncData(
      `content-table-nav-${String(collection)}`,
      () => queryCollectionNavigation(collection, ["description"]),
    )
  : { data: ref(null) };

const resolvedNodes = computed(() => {
  if (nodes) return nodes;
  if (!navigation.value) return [];
  if (versionPrefix) {
    const versionNode = navigation.value.find(
      (item: ContentNavigationItem) => item.path === `/${versionPrefix}`,
    );
    return versionNode?.children ?? [];
  }
  if (navigation.value.length === 1 && navigation.value[0].children?.length) {
    return navigation.value[0].children;
  }
  return navigation.value;
});

const headingComponents = { 3: resolveComponent("H3"), 4: resolveComponent("H4"), 5: resolveComponent("H5"), 6: resolveComponent("H6") } as const;
const heading = computed(() => headingComponents[Math.min(headingDepth, 6) as keyof typeof headingComponents]);
</script>

<template>
  <div class="f-content-table">
    <template v-for="node in resolvedNodes" :key="node.path">
      <!-- Leaf page -->
      <div v-if="!node.children?.length" class="f-content-table-section">
        <div class="f-content-table-grid">
          <div class="f-content-table-entry">
            <Anchor :to="node.path" class="f-content-table-entry-title">{{ node.title }}</Anchor>
            <span
              v-if="node.description"
              class="f-content-table-entry-description"
            >
              {{ node.description }}
            </span>
          </div>
        </div>
      </div>
      <!-- Category with children -->
      <div v-else class="f-content-table-section">
        <component :is="heading">
          <Icon v-if="node.title && navIcons[node.title]" :alias="navIcons[node.title]" />
          {{ node.title }}
        </component>
        <div class="f-content-table-grid">
          <template v-for="child in node.children" :key="child.path">
            <div v-if="!child.children?.length" class="f-content-table-entry">
              <Anchor :to="child.path" class="f-content-table-entry-title">{{ child.title }}</Anchor>
              <span
                v-if="child.description"
                class="f-content-table-entry-description"
              >
                {{ child.description }}
              </span>
            </div>
          </template>
        </div>
        <template v-for="child in node.children" :key="`sub-${child.path}`">
          <ContentTable
            v-if="child.children?.length"
            :nodes="[child]"
            :heading-depth="headingDepth + 1"
          />
        </template>
      </div>
    </template>
  </div>
</template>
