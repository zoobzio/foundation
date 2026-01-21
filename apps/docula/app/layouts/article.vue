<script setup lang="ts">
const { collection } = useAppConfig();
</script>

<template>
  <VersionBanner />
  <Main
    :tokens="{
      main: {
        'grid-template-columns': 'ref-layout-nav-content',
        'grid-template-rows': 'ref-layout-shell-header-content',
      },
    }"
  >
    <TopBar />
    <Left border>
      <ContentTree v-if="collection?.key" :collection="collection.key" />
    </Left>
    <slot />
    <Footer> Test </Footer>
  </Main>
</template>
