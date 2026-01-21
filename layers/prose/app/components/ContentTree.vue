<script lang="ts">
import type { PageCollections } from "@nuxt/content";
import type { caption } from "@foundation/blocks/elements";
import type { navList } from "../../elements.config";
import type { NavListGroup } from "./NavList.vue";

export interface ContentTreeProps {
  collection: keyof PageCollections;
  title?: string;
  icon?: IconAlias;
  tokens?: Tokens<
    | typeof caption.key
    | typeof navList.root
    | typeof navList.group
    | typeof navList.item
  >;
}
</script>

<script setup lang="ts">
const props = defineProps<ContentTreeProps>();

const styles = useTokenStyle(props.tokens);

const appConfig = useAppConfig();
const navIcons = computed(() => appConfig.collection?.navIcons ?? {});

const { data: navigation } = await useAsyncData(
  `content-tree-${props.collection}`,
  () => queryCollectionNavigation(props.collection),
);

// Transform navigation into flat groups (1 level deep only)
const groups = computed<NavListGroup[]>(() => {
  if (!navigation.value) return [];

  return navigation.value
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
  <Caption v-if="props.title" :icon="props.icon" :tokens="props.tokens">
    {{ props.title }}
  </Caption>
  <NavList :groups="groups" :tokens="props.tokens" />
</template>
