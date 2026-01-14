<template>
  <Main
    :tokens="{
      main: {
        'grid-template-columns': 'ref-layout-nav-content',
        'grid-template-rows': 'ref-layout-shell-header-content',
      },
    }"
  >
    <TopBar />
    <slot />
  </Main>
</template>
