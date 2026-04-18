<script lang="ts">
import type { PageCollections } from "@nuxt/content";

export interface ContentGridProps {
  collection: keyof PageCollections;}
</script>

<script setup lang="ts">
const { collection } = defineProps<ContentGridProps>();

const { data: items } = await useAsyncData(
  `content-grid-${String(collection)}`,
  () => queryCollection(collection).all(),
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
</script>

<template>
  <div v-if="items" class="f-content-grid-root">
    <NuxtLink
      v-for="item in items"
      :key="item.id"
      :to="`/${collection}${item.path}`"
      class="f-content-grid-item"
    >
      <span class="f-content-grid-title">
        {{ item.title }}
      </span>
      <span v-if="item.description" class="f-content-grid-description">
        {{ item.description }}
      </span>
      <div
        v-if="item.author || item.published"
        class="f-content-grid-meta"
      >
        <span v-if="item.author" class="f-content-grid-author">
          <Icon alias="user" />
          {{ item.author }}
        </span>
        <span v-if="item.published" class="f-content-grid-published">
          <Icon alias="calendar" />
          {{ formatDate(item.published) }}
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

