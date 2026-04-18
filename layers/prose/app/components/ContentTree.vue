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

// Transform navigation into groups with recursive nesting
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

  const mapItems = (children: typeof sections): NavListGroup["items"] =>
    children.map((child) => ({
      label: child.title,
      ...(child.children?.length
        ? { children: mapItems(child.children) }
        : { to: child.path }),
    }));

  return sections
    .filter((item) => item.children && item.children.length > 0)
    .map((folder) => ({
      label: folder.title,
      icon: navIcons.value[folder.title],
      items: mapItems(folder.children ?? []),
    }))
    .filter((group) => group.items.length > 0);
});
</script>

<template>
  <Caption v-if="props.title" :icon="props.icon">
    {{ props.title }}
  </Caption>
  <NavList :groups="groups" />
</template>
