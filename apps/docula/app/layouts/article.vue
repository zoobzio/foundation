<template>
  <Main
    :tokens="{
      main: {
        'grid-template-columns': 'ref-layout-sidebar-both',
      },
    }"
  >
    <TopBar />
    <slot />
  </Main>
</template>
