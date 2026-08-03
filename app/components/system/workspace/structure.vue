<script lang="ts">
import type {
  WorkspaceStructureContext,
  WorkspaceStructureEmits,
  WorkspaceStructurePassthrough,
  WorkspaceStructureProps,
  WorkspaceStructureSlots,
} from "~/types/system/workspace/structure";
import type { Events } from "#foundation/types/system/workspace";
import type { ComponentPublicInstance } from "vue";

import Footer from "#foundation/components/common/footer.vue";
import Group from "#foundation/components/common/group.vue";
import Header from "#foundation/components/common/header.vue";

import { useTemplateRef } from "#imports";
import { useHooks } from "#foundation/composables/hook";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useRequest } from "#foundation/composables/request";
</script>

<script setup lang="ts">
const { workspace, pt } = defineProps<WorkspaceStructureProps>();

const emit = defineEmits<WorkspaceStructureEmits>();

useHooks<Events>(workspace.id, {
  "workspace:initialized": (event) => emit("initialized", event),
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { layout, gridStyle, slotStyle } = workspace;

const settings = usePassthrough<WorkspaceStructurePassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    header: {},
    grid: {},
    slot: () => ({}),
    footer: {},
  },
}));

const ctx = useContext<WorkspaceStructureContext>("system-workspace", () => ({
  workspace,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<WorkspaceStructureSlots>();

await useRequest(`init-workspace-${workspace.id}`, workspace.init);
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-system-workspace">
    <slot name="header" v-bind="ctx">
      <Header v-bind="settings.header" class="f-system-workspace-header" />
    </slot>

    <Group
      v-bind="settings.grid"
      class="f-system-workspace-grid"
      :style="gridStyle"
    >
      <Group
        v-for="s in layout.slots"
        :key="s.id"
        v-bind="settings.slot(s)"
        class="f-system-workspace-slot"
        :style="slotStyle(s)"
      >
        <slot :name="`slot:${s.id}`" v-bind="{ ...ctx, slot: s }" />
      </Group>
    </Group>

    <slot name="footer" v-bind="ctx">
      <Footer v-bind="settings.footer" class="f-system-workspace-footer" />
    </slot>
  </Group>
</template>
