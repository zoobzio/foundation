<script setup lang="ts">
const route = useRoute();
const { current, latest, isLatest } = useVersion();

const latestUrl = computed(() => {
  const path = route.path.replace(/^\/v[\d.]+/, "");
  return `/${latest}${path}`;
});
</script>

<template>
  <Banner
    v-if="!isLatest && current && latest"
    icon="info"
  >
    <span>
      You're viewing docs for <Strong>{{ current }}</Strong
      >.
    </span>
    <Anchor :to="latestUrl">View latest ({{ latest }})</Anchor>
  </Banner>
</template>
