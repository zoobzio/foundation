<script lang="ts">
import type { NavListProps } from "../types/nav-list";
</script>

<script setup lang="ts">
const props = defineProps<NavListProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const route = useRoute();

const isActive = (to: string) => route.path === to;

const ctx = computed(() => ({ groups: props.groups }));
</script>

<template>
  <Nav
    ref="el"
    class="f-nav-list-root"
  >
    <slot v-bind="ctx">
      <Group
        v-for="group in props.groups"
        :key="group.label"
        class="f-nav-list-group"
      >
        <Caption v-if="group.label" :icon="group.icon">
          {{ group.label }}
        </Caption>
        <template v-for="item in group.items" :key="item.to ?? item.label">
          <NuxtLink
            v-if="item.to && !item.children?.length"
            :to="item.to"
            :aria-selected="isActive(item.to) ? 'true' : undefined"
            :data-selected="isActive(item.to) ? '' : undefined"
            class="f-nav-list-item"
          >
            <Icon v-if="item.icon" :alias="item.icon" />
            <Span class="f-nav-list-label">{{ item.label }}</Span>
          </NuxtLink>
          <Group v-else-if="item.children?.length" class="f-nav-list-nested">
            <Span class="f-nav-list-nested-label">
              <Icon v-if="item.icon" :alias="item.icon" />
              {{ item.label }}
            </Span>
            <NavList
              :groups="[{ label: '', items: item.children }]"
            />
          </Group>
        </template>
      </Group>
    </slot>
  </Nav>
</template>
