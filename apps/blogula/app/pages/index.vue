<script setup lang="ts">
const { data: posts } = await useAsyncData("posts", () =>
  queryCollection("content").order("published", "DESC").all(),
);

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <Section>
    <Article>
      <H1>Blog</H1>
      <P>Recent posts</P>
    </Article>
    <Hr />
    <nav v-if="posts?.length">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="post.path"
        class="f-blog-post-link"
      >
        <H3>{{ post.title }}</H3>
        <P v-if="post.description">{{ post.description }}</P>
        <small v-if="post.published">{{ formatDate(post.published) }}</small>
      </NuxtLink>
    </nav>
    <P v-else>No posts yet.</P>
  </Section>
</template>

<style scoped>
.f-blog-post-link {
  display: block;
  padding: 1rem 0;
  text-decoration: none;
  border-bottom: 1px solid var(--color-border, #e5e5e5);
}

.f-blog-post-link:hover {
  opacity: 0.8;
}

.f-blog-post-link:last-child {
  border-bottom: none;
}
</style>
