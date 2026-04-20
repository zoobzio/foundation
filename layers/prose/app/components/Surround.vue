<script lang="ts">
import type { PageCollections } from "@nuxt/content";
import type { SurroundProps } from "../types/surround";
</script>

<script setup lang="ts" generic="T extends keyof PageCollections">
const {
  collection,
  path,
  prevLabel = "Previous",
  nextLabel = "Next",
  order,
} = defineProps<SurroundProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

const { prev, next } = useContentSurround(collection, path, order);

const ctx = computed(() => ({ collection, path, prevLabel, nextLabel, prev: prev.value, next: next.value }));
</script>

<template>
  <Nav
    v-if="prev || next"
    ref="el"
    class="f-surround-root"
  >
    <slot v-bind="ctx">
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        class="f-surround-prev"
      >
        <Span class="f-surround-label">
          <Icon alias="chevron-left" />
          {{ prevLabel }}
        </Span>
        <Span class="f-surround-title">
          {{ prev.title }}
        </Span>
        <Span v-if="prev.description" class="f-surround-prev-description">
          {{ prev.description }}
        </Span>
      </NuxtLink>
      <NuxtLink
        v-if="next"
        :to="next.path"
        class="f-surround-next"
      >
        <Span class="f-surround-label">
          {{ nextLabel }}
          <Icon alias="chevron-right" />
        </Span>
        <Span class="f-surround-title">
          {{ next.title }}
        </Span>
        <Span v-if="next.description" class="f-surround-next-description">
          {{ next.description }}
        </Span>
      </NuxtLink>
    </slot>
  </Nav>
</template>
