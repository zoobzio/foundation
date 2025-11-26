<script setup lang="ts">
const open = ref(false);

const isMac = computed(() => {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));
</script>

<template>
  <Tooltip>
    <Button shortcut="k" @click="open = true">
      <Icon alias="search" />
    </Button>
    <template #content>
      <span>Search</span>
      <Kbd>
        {{ modKey }}
        <Icon alias="plus" :tokens="{ icon: { 'font-size': 'ref-text-xs' } }" />
        K
      </Kbd>
    </template>
  </Tooltip>

  <Dialog v-model:open="open" title="Search for stuff" description="SEARCH BRO">
    <P>Search dialog content</P>
  </Dialog>
</template>
