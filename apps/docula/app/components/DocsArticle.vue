<script setup lang="ts">
import type { ParsedContent } from "@nuxt/content";

const props = defineProps<{
  collection: string;
  path: string;
  content: ParsedContent;
  repo?: string;
}>();
</script>

<template>
  <Left border>
    <ContentTree
      :collection="collection"
      title="In this collection"
      icon="folder-open"
    />
  </Left>
  <Container>
    <Section>
      <Article>
        <ContentRenderer :value="content" />
      </Article>
      <Attribution
        :author="content.author"
        :published="content.published"
        :tags="content.tags"
      />
      <Surround :collection="collection" :path="path" />
    </Section>
    <Right border>
      <Toc v-if="content?.body?.toc?.links" :links="content.body.toc.links" />
    </Right>
  </Container>
</template>
