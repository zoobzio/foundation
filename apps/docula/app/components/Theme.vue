<script setup lang="ts">
const open = ref(false);

const isMac = computed(() => {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));
</script>

<template>
  <Tooltip>
    <Button shortcut="t" @click="open = true">
      <Icon alias="theme" />
    </Button>
    <template #content>
      <span>Theme</span>
      <Kbd>
        {{ modKey }}
        <Icon alias="plus" :tokens="{ icon: { 'font-size': 'ref-text-xs' } }" />
        T
      </Kbd>
    </template>
  </Tooltip>

  <Dialog
    v-model:open="open"
    title="I am a Theme selector!"
    description="change your theme bro"
  >
    <P>Theme selection dialog content</P>
  </Dialog>
</template>
