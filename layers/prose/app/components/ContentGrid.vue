<script lang="ts">
import type { ContentGridProps, ContentGridItem } from "../types/content-grid";
</script>

<script setup lang="ts">
const { collection } = defineProps<ContentGridProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const { data: items } = await useAsyncData(
  `content-grid-${String(collection)}`,
  () => queryCollection(collection).all() as Promise<ContentGridItem[]>,
);

const formatDate = (dateString: string) => {
  const raw = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? dateString + "T00:00:00"
    : dateString;
  const date = new Date(raw);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ctx = computed(() => ({ collection, items: items.value }));
</script>

<template>
  <Group v-if="items" ref="el" class="f-content-grid-root">
    <slot v-bind="ctx">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="`/${collection}${item.path}`"
        class="f-content-grid-item"
      >
        <Span class="f-content-grid-title">
          {{ item.title }}
        </Span>
        <Span v-if="item.description" class="f-content-grid-description">
          {{ item.description }}
        </Span>
        <Group
          v-if="item.author || item.published"
          class="f-content-grid-meta"
        >
          <Span v-if="item.author" class="f-content-grid-author">
            <Icon alias="user" />
            {{ item.author }}
          </Span>
          <Span v-if="item.published" class="f-content-grid-published">
            <Icon alias="calendar" />
            {{ formatDate(item.published) }}
          </Span>
        </Group>
      </NuxtLink>
    </slot>
  </Group>
</template>
