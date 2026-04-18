<script setup lang="ts">
const { theme, themes, setTheme } = useUntheme();

const open = ref(false);

const formatLabel = (t: string) =>
  t.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const themeItems = computed(() =>
  themes.value.map((t) => ({
    value: t,
    label: formatLabel(t),
    disabled: t === theme.value,
  })),
);

const displayLabel = computed(() => formatLabel(theme.value));

const handleSelect = (value: string) => {
  open.value = false;
  setTheme(value);
};

const isMac = computed(() => {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));
</script>

<template>
  <Popover v-model:open="open" side="top" align="end">
    <Tooltip align="end">
      <Fab shortcut="meta+t" icon="theme" aria-label="Theme" @click="open = !open" />
      <template #content>
        <span>{{ displayLabel }}</span>
        <Kbd>
          {{ modKey }}
          <Icon alias="plus" />
          T
        </Kbd>
      </template>
    </Tooltip>
    <template #content>
      <Command
        :groups="[{ key: 'themes', items: themeItems }]"
        placeholder="Search themes..."
        @select="handleSelect"
        @keydown.escape="open = false"
      >
        <template #item="{ item }">
          <Icon v-if="item.disabled" alias="check" />
          <span class="f-command-item-label">{{ item.label }}</span>
        </template>
      </Command>
    </template>
  </Popover>
</template>
