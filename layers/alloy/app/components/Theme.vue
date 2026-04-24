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

const popoverPT = usePassthrough(pt?.popover, {
  props: { side: "top", align: "end" },
});
const tooltipPT = usePassthrough(pt?.tooltip, {
  props: { align: "end" },
});
const fabPT = usePassthrough(pt?.fab, {
  props: { shortcut: "meta+t" as ButtonShortcut, icon: "theme" as IconAlias, "aria-label": "Theme" },
  handlers: { click: () => { open.value = !open.value; } },
});
const commandPT = usePassthrough(pt?.command, {
  props: { groups: [{ key: "themes", items: themeItems.value }], placeholder: "Search themes..." },
  handlers: { select: handleSelect },
});

const ctx = computed(() => ({ theme: theme.value, themes: themes.value, open: open.value, displayLabel: displayLabel.value, modKey: modKey.value, themeItems: themeItems.value }));
</script>

<template>
  <Popover ref="el" v-model:open="open" v-bind="popoverPT.props" v-on="popoverPT.handlers">
    <slot name="tooltip" v-bind="ctx">
      <Tooltip v-bind="tooltipPT.props" v-on="tooltipPT.handlers">
        <slot name="fab" v-bind="ctx">
          <Fab v-bind="fabPT.props" v-on="fabPT.handlers" />
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
          v-bind="commandPT.props"
          v-on="commandPT.handlers"
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
