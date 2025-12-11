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
        'border-left-width': border ? 'ref-hairline' : 'ref-none',
        'border-left-style': 'ref-border-style-solid',
        'border-color': 'sys-outline',
      },
    }"
  >
    <Aside>
      <slot />
    </Aside>
  </Nav>
</template>
