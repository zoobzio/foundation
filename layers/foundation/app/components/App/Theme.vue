<script lang="ts">
import type { AppThemeProps } from "../../types/app-theme";
</script>

<script setup lang="ts">
const { pt } = defineProps<AppThemeProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const open = ref(false);
const { theme, setTheme, themes } = useUntheme();

const groups = computed<CommandGroup[]>(() => [
  {
    key: "themes",
    label: "Themes",
    items: themes.value.map((name) => ({
      value: name,
      label: name,
    })),
  },
]);

const onSelect = (value: string) => {
  setTheme(value);
  open.value = false;
};

const ctx = computed(() => ({ open: open.value, theme: theme.value, themes: themes.value }));
</script>

<template>
  <Group ref="el" v-bind="pt?.root" class="f-app-theme">
    <slot name="trigger" v-bind="ctx">
      <Fab
        v-bind="pt?.trigger"
        icon="theme"
        class="f-app-theme-trigger"
        @click="open = true"
      />
    </slot>

    <Dialog
      v-bind="pt?.dialog"
      :open="open"
      title="Theme"
      description="Choose a theme and mode"
      class="f-app-theme-dialog"
      @update:open="open = $event"
    >
      <slot name="command" v-bind="ctx">
        <Command
          v-bind="pt?.command"
          :groups="groups"
          placeholder="Search themes..."
          class="f-app-theme-command"
          @select="onSelect"
        />
      </slot>
    </Dialog>
  </Group>
</template>
