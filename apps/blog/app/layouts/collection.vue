<script setup lang="ts">
const tabs = [
  { value: "blog", label: "Blog" },
  { value: "projects", label: "Projects" },
  { value: "about", label: "About" },
];
</script>

<template>
  <Main
    :tokens="{
      main: {
        'grid-template-columns': 'ref-layout-sidebar-left',
      },
    }"
  >
    <TopBar>
      <template #logo>
        <Avatar
          src="https://github.com/zoobzio.png"
          alt="zoobzio"
          fallback="Z"
        />
      </template>
    </TopBar>
    <slot />
  </Main>
</template>
