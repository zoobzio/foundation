<script lang="ts">
import type { ColorModeProps } from "../types/color-mode";
</script>

<script setup lang="ts">
const { pt } = defineProps<ColorModeProps>();

const el = useTemplateRef("el");
defineExpose({ el });

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

const tooltipPT = usePassthrough(pt?.tooltip, {
  props: { align: "end" },
});
const fabPT = usePassthrough(pt?.fab, {
  props: { shortcut: "meta+d" as ButtonShortcut, icon: mode.value as IconAlias, "aria-label": label.value },
  handlers: { click: toggle },
});

const ctx = computed(() => ({ mode: mode.value, isDark: isDark.value, label: label.value, modKey: modKey.value, toggle }));
</script>

<template>
  <slot ref="el" name="tooltip" v-bind="ctx">
    <Tooltip v-bind="tooltipPT.props" v-on="tooltipPT.handlers">
      <slot name="fab" v-bind="ctx">
        <Fab v-bind="fabPT.props" v-on="fabPT.handlers" />
      </slot>
      <template #content>
        <slot name="content" v-bind="ctx">
          <Span>{{ label }}</Span>
          <Kbd>
            {{ modKey }}
            <Icon alias="plus" />
            D
          </Kbd>
        </slot>
      </template>
    </Tooltip>
  </slot>
</template>
