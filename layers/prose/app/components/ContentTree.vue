<script lang="ts">
import type { PageCollections } from "@nuxt/content";
import type { NavListGroup } from "./NavList.vue";

export interface ContentTreeProps {
  collection: keyof PageCollections;
  /** Version prefix to scope navigation (e.g. "v1.0.0") */
  versionPrefix?: string;
  title?: string;
  icon?: IconAlias;
}
</script>

<script setup lang="ts">
const props = defineProps<ContentTreeProps>();

const appConfig = useAppConfig();
const navIcons = computed(() => appConfig.collection?.navIcons ?? {});

const { data: navigation } = await useAsyncData(
  `content-tree-${props.collection}`,
  () => queryCollectionNavigation(props.collection),
);

// Transform navigation into flat groups (1 level deep only)
// When a versionPrefix is provided, drill into the matching version subtree first
const groups = computed<NavListGroup[]>(() => {
  if (!navigation.value) return [];

  let sections = navigation.value;

  if (props.versionPrefix) {
    const versionNode = sections.find(
      (item) => item.path === `/${props.versionPrefix}`,
    );
    if (!versionNode?.children) return [];
    sections = versionNode.children;
  }

  return sections
    .filter((item) => item.children && item.children.length > 0)
    .map((folder) => ({
      label: folder.title,
      icon: navIcons.value[folder.title],
      items: (folder.children ?? [])
        .filter((child) => !child.children) // Only leaf items, ignore nested folders
        .map((child) => ({
          label: child.title,
          to: child.path,
        })),
    }))
    .filter((group) => group.items.length > 0); // Only groups with items
});
</script>

<template>
  <Caption v-if="props.title" :icon="props.icon">
    {{ props.title }}
  </Caption>
  <NavList :groups="groups" />
</template>
