<script lang="ts">
import type { ContentTreeProps } from "../types/content-tree";
import type { NavListGroup } from "../types/nav-list";
</script>

<script setup lang="ts">
const props = defineProps<ContentTreeProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const appConfig = useAppConfig() as { collection?: { navIcons?: Record<string, IconAlias> } };
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

const ctx = computed(() => ({ collection: props.collection, versionPrefix: props.versionPrefix, title: props.title, icon: props.icon, groups: groups.value }));
</script>

<template>
  <Group ref="el">
    <slot v-bind="ctx">
      <Caption v-if="props.title" :icon="props.icon">
        {{ props.title }}
      </Caption>
      <NavList :groups="groups" />
    </slot>
  </Group>
</template>
