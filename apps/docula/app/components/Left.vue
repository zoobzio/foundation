<script setup lang="ts">
defineProps<{
  border?: boolean;
}>();
</script>

<template>
  <Nav
    :tokens="{
      nav: {
        width: 'ref-width-xs',
        'border-right-width': border ? 'ref-hairline' : 'ref-none',
        'border-right-style': 'ref-border-style-solid',
        'border-color': 'sys-outline',
      },
    }"
  >
    <Aside>
      <slot />
    </Aside>
  </Nav>
</template>
