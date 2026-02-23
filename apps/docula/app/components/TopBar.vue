<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <Header>
    <div class="f-topbar-left">
      <slot name="logo">
        <AsciiLogo :text="appConfig.title ?? 'Docula'" :link="true" />
      </slot>
      <VersionSelector />
    </div>
    <div class="f-topbar-center">
      <Search />
    </div>
    <div class="f-topbar-right">
      <slot name="actions">
        <FontMode />
        <Theme />
        <ColorMode />
      </slot>
    </div>
  </Header>
</template>
