<template>
  <Main
    :tokens="{
      main: {
        'grid-template-columns': 'ref-layout-sidebar-left',
      },
    }"
  >
    <TopBar />
    <slot />
  </Main>
</template>
