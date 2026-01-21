<script setup lang="ts">
const route = useRoute();
const { current, latest, isLatest } = useVersion();

const latestUrl = computed(() => {
  const path = route.path.replace(/^\/v[\d.]+/, "");
  return `/v${latest}${path}`;
});
</script>

<template>
  <Banner
    v-if="!isLatest && current && latest"
    icon="info"
    :tokens="{
      banner: {
        display: 'ref-display-flex',
        background: 'sys-secondary-container',
        text: 'sys-on-secondary-container',
        'font-size': 'ref-text-sm',
        'padding-top': 'ref-spacing-xs',
        'padding-bottom': 'ref-spacing-xs',
        'padding-left': 'ref-spacing-sm',
        'padding-right': 'ref-spacing-sm',
        'justify-content': 'ref-justify-center',
        'align-items': 'ref-align-center',
        gap: 'ref-spacing-xs',
      },
    }"
  >
    <span>
      You're viewing docs for <Strong>v{{ current }}</Strong
      >.
    </span>
    <Anchor :to="latestUrl">View latest (v{{ latest }})</Anchor>
  </Banner>
</template>
