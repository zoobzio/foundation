<script setup lang="ts">
const { collection } = useAppConfig();
const { current } = useVersion();
</script>

<template>
  <VersionBanner />
  <Main>
    <TopBar />
    <Left border>
      <ContentTree
        v-if="collection?.key"
        :collection="collection.key"
        :version-prefix="current"
      />
    </Left>
    <slot />
  </Main>
</template>
