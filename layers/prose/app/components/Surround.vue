<script lang="ts">
import type { PageCollections } from "@nuxt/content";
import type { surround } from "../../elements.config";

export interface SurroundProps<T extends keyof PageCollections> {
  collection: T;
  path?: string;
  prevLabel?: string;
  nextLabel?: string;
  tokens?: Tokens<
    | typeof surround.root
    | typeof surround.prev
    | typeof surround.next
    | typeof surround.label
    | typeof surround.title
    | typeof surround.prevDescription
    | typeof surround.nextDescription
  >;
}
</script>

<script setup lang="ts" generic="T extends keyof PageCollections">
const {
  collection,
  path,
  prevLabel = "Previous",
  nextLabel = "Next",
  tokens,
} = defineProps<SurroundProps<T>>();

const { prev, next } = useContentSurround(collection, path);

const styles = useTokenStyle(tokens);
</script>

<template>
  <nav
    v-if="prev || next"
    :style="styles['surround-root']"
    class="f-surround-root"
  >
    <NuxtLink
      v-if="prev"
      :to="prev.path"
      :style="styles['surround-prev']"
      class="f-surround-prev"
    >
      <span :style="styles['surround-label']" class="f-surround-label">
        <Icon alias="chevron-left" />
        {{ prevLabel }}
      </span>
      <span :style="styles['surround-title']" class="f-surround-title">
        {{ prev.title }}
      </span>
      <span v-if="prev.description" :style="styles['surround-prev-description']" class="f-surround-prev-description">
        {{ prev.description }}
      </span>
    </NuxtLink>
    <NuxtLink
      v-if="next"
      :to="next.path"
      :style="styles['surround-next']"
      class="f-surround-next"
    >
      <span :style="styles['surround-label']" class="f-surround-label">
        {{ nextLabel }}
        <Icon alias="chevron-right" />
      </span>
      <span :style="styles['surround-title']" class="f-surround-title">
        {{ next.title }}
      </span>
      <span v-if="next.description" :style="styles['surround-next-description']" class="f-surround-next-description">
        {{ next.description }}
      </span>
    </NuxtLink>
  </nav>
</template>

<style>
@import '#build/untheme/surround-root.css';
@import '#build/untheme/surround-prev.css';
@import '#build/untheme/surround-next.css';
@import '#build/untheme/surround-label.css';
@import '#build/untheme/surround-title.css';
@import '#build/untheme/surround-prev-description.css';
@import '#build/untheme/surround-next-description.css';
</style>
