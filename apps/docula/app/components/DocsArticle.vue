<script setup lang="ts">
import type { ParsedContentv2 } from "@nuxt/content";

interface ContentWithMeta extends ParsedContentv2 {
  author?: string;
  published?: string;
  updated?: string;
  readtime?: string;
}

const props = defineProps<{
  collection: string;
  path: string;
  content: ContentWithMeta;
  repo?: string;
}>();

const editUrl = computed(() => {
  if (!props.repo) return undefined;
  // Convert repo URL to edit URL: https://github.com/owner/repo -> https://github.com/owner/repo/edit/main/content/...
  const repoBase = props.repo.replace(/\/$/, "");
  return `${repoBase}/edit/main/content${props.path}.md`;
});
</script>

<template>
  <Container>
    <Section>
      <Attribution
        :author="content?.author"
        :published="content?.published"
        :updated="content?.updated"
        :readtime="content?.readtime"
        :edit-url="editUrl"
      />
      <Article>
        <ContentRenderer :value="content" />
      </Article>
      <Surround :collection="collection" :path="path" />
    </Section>
    <Right>
      <Toc v-if="content?.body?.toc?.links" :links="content.body.toc.links" />
    </Right>
  </Container>
</template>
