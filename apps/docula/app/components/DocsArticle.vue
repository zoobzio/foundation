<script setup lang="ts">
import type { ParsedContent } from "@nuxt/content";
import type { CommunityLink } from "./Community.vue";

const props = defineProps<{
  collection: string;
  path: string;
  content: ParsedContent;
  repo?: string;
}>();

const communityLinks = computed<CommunityLink[]>(() => {
  if (!props.repo) return [];

  return [
    {
      label: "Edit on GitHub",
      to: `${props.repo}/edit/main/docs${props.path}.md`,
      icon: "edit-document",
    },
    {
      label: "Report an issue",
      to: `${props.repo}/issues/new`,
      icon: "report-issue",
    },
  ];
});
</script>

<template>
  <Left border>
    <ContentTree :collection="collection" title="In this collection" icon="folder-open" />
  </Left>
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
    <Community v-if="communityLinks.length" :links="communityLinks" />
  </Right>
</template>
