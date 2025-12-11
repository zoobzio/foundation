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
    <Button shortcut="l" @click="open = true">
      <Icon alias="translate" />
    </Button>
    <template #content>
      <span>Translate</span>
      <Kbd>
        {{ modKey }}
        <Icon alias="plus" :tokens="{ icon: { 'font-size': 'ref-text-xs' } }" />
        L
      </Kbd>
    </template>
  </Tooltip>

  <Dialog
    v-model:open="open"
    title="Translate languages"
    description="I am a banana"
  >
    <P>Language selection dialog content</P>
  </Dialog>
</template>
