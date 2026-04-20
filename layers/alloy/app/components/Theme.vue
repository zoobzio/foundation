<script lang="ts">
import type { ThemeProps } from "../types/theme";
</script>

<script setup lang="ts">
const { pt } = defineProps<ThemeProps>();

const el = useTemplateRef("el");
defineExpose({ el });

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

const ctx = computed(() => ({ theme: theme.value, themes: themes.value, open: open.value, displayLabel: displayLabel.value, modKey: modKey.value, themeItems: themeItems.value }));
</script>

<template>
  <Popover ref="el" v-model:open="open" v-bind="pt?.popover" side="top" align="end">
    <slot name="tooltip" v-bind="ctx">
      <Tooltip v-bind="pt?.tooltip" align="end">
        <slot name="fab" v-bind="ctx">
          <Fab v-bind="pt?.fab" shortcut="meta+t" icon="theme" aria-label="Theme" @click="open = !open" />
        </slot>
        <template #content>
          <slot name="content" v-bind="ctx">
            <Span>{{ displayLabel }}</Span>
            <Kbd>
              {{ modKey }}
              <Icon alias="plus" />
              T
            </Kbd>
          </slot>
        </template>
      </Tooltip>
    </slot>
    <template #content>
      <slot name="command" v-bind="ctx">
        <Command
          v-bind="pt?.command"
          :groups="[{ key: 'themes', items: themeItems }]"
          placeholder="Search themes..."
          @select="handleSelect"
          @keydown.escape="open = false"
        >
          <template #item="{ item }">
            <slot name="item" v-bind="{ ...ctx, item }">
              <Icon v-if="item.disabled" alias="check" />
              <Span class="f-command-item-label">{{ item.label }}</Span>
            </slot>
          </template>
        </Command>
      </slot>
    </template>
  </Popover>
</template>
