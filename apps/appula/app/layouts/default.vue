<script setup lang="ts">
const appConfig = useAppConfig();

const isMac = computed(() => {
  if (import.meta.client) {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));
</script>

<template>
  <Main>
    <div class="f-dashboard">
      <Aside class="f-dashboard-sidebar">
        <div class="f-dashboard-logo">
          <AsciiLogo :text="appConfig.title" />
        </div>
        <div class="f-dashboard-search">
          <Input placeholder="Search..." readonly shortcut="meta+k">
            <template #prepend>
              <Icon alias="search" />
            </template>
            <template #append>
              <Kbd>{{ modKey }} + K</Kbd>
            </template>
          </Input>
        </div>
        <SidebarNav :groups="appConfig.navigation" />
      </Aside>
      <div class="f-dashboard-content">
        <slot />
      </div>
    </div>
  </Main>
</template>
