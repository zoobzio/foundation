<script setup lang="ts">
defineProps<{
  collections: Array<{ key: string; title: string; description?: string; icon?: string; to: string }>;
}>();
</script>

<template>
  <Section>
    <H1>Welcome</H1>
    <P>Landing page placeholder</P>
    <Ul>
      <Li v-for="collection in collections" :key="collection.key">
        <A :to="collection.to">{{ collection.title }}</A>
      </Li>
    </Ul>
  </Section>
</template>
