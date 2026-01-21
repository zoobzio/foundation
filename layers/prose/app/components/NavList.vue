<script lang="ts">
import type { navList } from "../../elements.config";

export interface NavListItem {
  label: string;
  to: string;
  icon?: IconAlias;
}

export interface NavListGroup {
  label: string;
  icon?: IconAlias;
  items: NavListItem[];
}

export interface NavListProps {
  groups: NavListGroup[];
  tokens?: Tokens<
    | typeof navList.root
    | typeof navList.group
    | typeof navList.item
    | typeof navList.label
  >;
}
</script>

<script setup lang="ts">
const props = defineProps<NavListProps>();

const styles = useTokenStyle(props.tokens);

const route = useRoute();

const isActive = (to: string) => route.path === to;
</script>

<template>
  <nav
    :style="styles['nav-list-root']"
    class="f-nav-list-root"
  >
    <div
      v-for="group in props.groups"
      :key="group.label"
      :style="styles['nav-list-group']"
      class="f-nav-list-group"
    >
      <Caption :icon="group.icon">
        {{ group.label }}
      </Caption>
      <NuxtLink
        v-for="item in group.items"
        :key="item.to"
        :to="item.to"
        :style="styles['nav-list-item']"
        :aria-selected="isActive(item.to) ? 'true' : undefined"
        :data-selected="isActive(item.to) ? '' : undefined"
        class="f-nav-list-item"
      >
        <Icon v-if="item.icon" :alias="item.icon" />
        <span :style="styles['nav-list-label']" class="f-nav-list-label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style>
@import '#build/untheme/nav-list-root.css';
@import '#build/untheme/nav-list-group.css';
@import '#build/untheme/nav-list-item.css';
@import '#build/untheme/nav-list-label.css';
</style>
