<script setup lang="ts">
const { mode } = useUntheme();

const isDark = computed(() => mode.value === "dark");

const label = computed(() => (isDark.value ? "Dark" : "Light"));

const isMac = computed(() => {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));

const toggle = () => {
  mode.value = isDark.value ? "light" : "dark";
};
</script>

<template>
  <Tooltip>
    <Button shortcut="d" @click="toggle">
      <Icon :alias="mode" />
    </Button>
    <template #content>
      <span>{{ label }}</span>
      <Kbd>
        {{ modKey }}
        <Icon
          alias="plus"
          :tokens="{ icon: { 'font-size': 'ref-text-2xs' } }"
        />
        D
      </Kbd>
    </template>
  </Tooltip>
</template>
