<script setup lang="ts">
const { data: syntaxContent } = await useAsyncData("test-content", () =>
  queryCollection("example").path("/test").first(),
);
</script>

<template>
  <Article>
    <H1>Blog Home</H1>
    <P>Welcome to the Foundation blog built with content-layer layouts.</P>

    <H2>Syntax Highlighting Example</H2>
    <ContentRenderer v-if="syntaxContent" :value="syntaxContent" />
  </Article>
</template>
