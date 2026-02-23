<script lang="ts">
export interface SidebarNavItem {
  label: string;
  to: string;
  icon?: IconAlias;
}

export interface SidebarNavGroup {
  label: string;
  icon?: IconAlias;
  items: SidebarNavItem[];
}
</script>

<script setup lang="ts">
const props = defineProps<{
  groups: SidebarNavGroup[];
}>();

const route = useRoute();
const isActive = (to: string) => route.path === to;
</script>

<template>
  <nav class="f-nav-list-root">
    <div
      v-for="group in props.groups"
      :key="group.label"
      class="f-nav-list-group"
    >
      <Caption :icon="group.icon">
        {{ group.label }}
      </Caption>
      <NuxtLink
        v-for="item in group.items"
        :key="item.to"
        :to="item.to"
        :aria-selected="isActive(item.to) ? 'true' : undefined"
        :data-selected="isActive(item.to) ? '' : undefined"
        class="f-nav-list-item"
      >
        <Icon v-if="item.icon" :alias="item.icon" />
        <span class="f-nav-list-label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
