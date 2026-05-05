<script lang="ts">
import type { AppLocaleProps } from "../../types/app-locale";
</script>

<script setup lang="ts">
const { pt } = defineProps<AppLocaleProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const open = ref(false);
const { locale, locales, setLocale } = useRosetta();

const groups = computed<CommandGroup[]>(() => [
  {
    key: "locales",
    label: "Language",
    items: locales.value.map((code) => ({
      value: code,
      label: code,
    })),
  },
]);

const onSelect = async (value: string) => {
  await setLocale(value);
  open.value = false;
};

const ctx = computed(() => ({ open: open.value, locale: locale.value, locales: locales.value }));
</script>

<template>
  <Group ref="el" v-bind="pt?.root" class="f-app-locale">
    <slot name="trigger" v-bind="ctx">
      <Fab
        v-bind="pt?.trigger"
        icon="translate"
        class="f-app-locale-trigger"
        @click="open = true"
      />
    </slot>

    <Dialog
      v-bind="pt?.dialog"
      :open="open"
      title="Language"
      description="Choose a language"
      class="f-app-locale-dialog"
      @update:open="open = $event"
    >
      <slot name="command" v-bind="ctx">
        <Command
          v-bind="pt?.command"
          :groups="groups"
          placeholder="Search languages..."
          class="f-app-locale-command"
          @select="onSelect"
        />
      </slot>
    </Dialog>
  </Group>
</template>
