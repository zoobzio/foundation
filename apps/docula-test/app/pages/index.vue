<script setup lang="ts">
const { data: articles } = await useAsyncData("articles", () =>
  queryCollection("sentinel").all()
);
</script>

<template>
  <div>
    <h1>Sentinel Documentation</h1>
    <ul v-if="articles">
      <li v-for="article in articles" :key="article.path">
        <NuxtLink :to="article.path">
          {{ article.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
