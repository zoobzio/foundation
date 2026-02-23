<script setup lang="ts">
const route = useRoute();

const contentPath = computed(() => {
  const s = route.params.slug;
  if (!s || (Array.isArray(s) && s.length === 0)) return "/";
  return `/${Array.isArray(s) ? s.join("/") : s}`;
});

const { data: post } = await useAsyncData(`post-${contentPath.value}`, () =>
  queryCollection("content").path(contentPath.value).first(),
);

useHead({
  title: post.value?.title ?? "Post",
});
</script>

<template>
  <Section v-if="post">
    <Article>
      <H1>{{ post.title }}</H1>
      <ContentRenderer :value="post" />
    </Article>
  </Section>
  <Section v-else>
    <Article>
      <H1>Not Found</H1>
      <P>Post not found at {{ contentPath }}</P>
    </Article>
  </Section>
</template>
