<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

defineProps<{
  collection: string;
  title: string;
  description?: string;
  navigation: ContentNavigationItem[];
}>();
</script>

<template>
  <Left border>
    <ContentFilters :collection="collection" />
  </Left>
  <Section>
    <Article>
      <H1>{{ title }}</H1>
      <P v-if="description">{{ description }}</P>
    </Article>
    <Hr
      :tokens="{
        hr: { 'margin-top': 'ref-none', 'margin-bottom': 'ref-none' },
      }"
    />
    <ContentAccordion
      v-if="navigation"
      :items="navigation"
      :collection="collection"
    />
  </Section>
</template>
