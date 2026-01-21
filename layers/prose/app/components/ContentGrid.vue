<script lang="ts">
import type { PageCollections } from "@nuxt/content";
import type { contentGrid } from "../../elements.config";

export interface ContentGridProps {
  collection: keyof PageCollections;
  tokens?: Tokens<
    | typeof contentGrid.root
    | typeof contentGrid.item
    | typeof contentGrid.title
    | typeof contentGrid.description
    | typeof contentGrid.meta
    | typeof contentGrid.author
    | typeof contentGrid.published
  >;
}
</script>

<script setup lang="ts">
const { collection, tokens } = defineProps<ContentGridProps>();

const styles = useTokenStyle(tokens);

const { data: items } = await useAsyncData(
  `content-grid-${String(collection)}`,
  () => queryCollection(collection).all(),
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div v-if="items" :style="styles['content-grid-root']" class="f-content-grid-root">
    <NuxtLink
      v-for="item in items"
      :key="item.id"
      :to="`/${collection}${item.path}`"
      :style="styles['content-grid-item']"
      class="f-content-grid-item"
    >
      <span :style="styles['content-grid-title']" class="f-content-grid-title">
        {{ item.title }}
      </span>
      <span v-if="item.description" :style="styles['content-grid-description']" class="f-content-grid-description">
        {{ item.description }}
      </span>
      <div
        v-if="item.author || item.published"
        :style="styles['content-grid-meta']"
        class="f-content-grid-meta"
      >
        <span v-if="item.author" :style="styles['content-grid-author']" class="f-content-grid-author">
          <Icon alias="user" />
          {{ item.author }}
        </span>
        <span v-if="item.published" :style="styles['content-grid-published']" class="f-content-grid-published">
          <Icon alias="calendar" />
          {{ formatDate(item.published) }}
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<style>
@import '#build/untheme/content-grid-root.css';
@import '#build/untheme/content-grid-item.css';
@import '#build/untheme/content-grid-title.css';
@import '#build/untheme/content-grid-description.css';
@import '#build/untheme/content-grid-meta.css';
@import '#build/untheme/content-grid-author.css';
@import '#build/untheme/content-grid-published.css';
</style>
