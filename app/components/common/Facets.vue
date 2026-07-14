<script lang="ts">
import type { FacetsProps, FacetsEmits } from "#foundation/types/core/facets";
</script>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import type { IconAlias } from "#foundation/types/common/iconic";
import Command from "#foundation/components/core/Command.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Popover from "#foundation/components/core/Popover.vue";
const { groups, selected, pt } = defineProps<FacetsProps>();

const emit = defineEmits<FacetsEmits>();

const el = useTemplateRef("el");
defineExpose({ el });
const open = ref(false);
const activeCount = computed(() => selected?.size ?? 0);

const popoverPT = usePassthrough(pt?.popover, () => ({
  props: { open: open.value, align: "end" as const },
  handlers: { "update:open": (v: boolean) => { open.value = v; } },
}));
const triggerPT = usePassthrough(pt?.trigger, () => ({
  props: { icon: "filter" as IconAlias, badge: activeCount.value > 0 ? activeCount.value : undefined },
  handlers: {},
}));
const commandPT = usePassthrough(pt?.command, () => ({
  props: { groups, placeholder: "Search filters...", multiple: true, selected },
  handlers: { "update:selected": (v: Set<string>) => { emit("update:selected", v); } },
}));

const ctx = computed(() => ({ groups, selected, activeCount: activeCount.value }));
</script>

<template>
  <Popover ref="el" v-bind="popoverPT.props" v-on="popoverPT.handlers">
    <template #trigger>
      <slot name="trigger" v-bind="ctx">
        <Fab v-bind="triggerPT.props" v-on="triggerPT.handlers" />
      </slot>
    </template>
    <template #content>
      <slot v-bind="ctx">
        <Command
          v-bind="commandPT.props"
          v-on="commandPT.handlers"
          @keydown.escape="open = false"
        />
      </slot>
    </template>
  </Popover>
</template>
