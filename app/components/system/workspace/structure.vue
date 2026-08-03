<script lang="ts">
import type {
  WorkspaceStructureContext,
  WorkspaceStructureEmits,
  WorkspaceStructurePassthrough,
  WorkspaceStructureProps,
  WorkspaceStructureSlots,
} from "#foundation/types/system/workspace/structure";
import type { Events } from "#foundation/types/system/workspace";
import type { Widgets } from "#foundation/types/widget";
import type { ComponentPublicInstance } from "vue";

import Footer from "#foundation/components/common/footer.vue";
import Group from "#foundation/components/common/group.vue";
import Header from "#foundation/components/common/header.vue";

import { toValue, useTemplateRef } from "#imports";
import { useWorkspace } from "#foundation/composables/workspace";
import { useHooks } from "#foundation/composables/hook";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useRequest } from "#foundation/composables/request";
</script>

<script setup lang="ts" generic="R extends Widgets">
const { service, pt } = defineProps<WorkspaceStructureProps<R>>();

const emit = defineEmits<WorkspaceStructureEmits>();

useHooks<Events>(service.id, {
  "workspace:initialized": (event) => emit("initialized", event),
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { gridStyle, cells } = useWorkspace(service);

const settings = usePassthrough<WorkspaceStructurePassthrough<R>>(() => ({
  pt,
  recipes: {
    root: {},
    header: {},
    grid: {},
    slot: () => ({}),
    footer: {},
  },
}));

const ctx = useContext<WorkspaceStructureContext<R>>(
  "system-workspace",
  () => ({
    workspace: service,
    el: el.value,
    settings: settings.value,
  }),
);

defineExpose({ ctx });
defineSlots<WorkspaceStructureSlots<R>>();

await useRequest(`init-workspace-${service.id}`, () => service.init());
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
        v-for="c in cells"
        :key="c.slot.id"
        v-bind="settings.slot(c.slot)"
        class="f-system-workspace-slot"
        :style="service.slotStyle(c.slot)"
      >
        <slot :name="`slot:${c.slot.id}`" v-bind="{ ...ctx, slot: c.slot }">
          <template v-if="c.widget">
            <slot
              :name="`widget:${c.key}`"
              v-bind="{ ...ctx, slot: c.slot, service: c.widget.service }"
            >
              <component
                :is="c.widget.component"
                :service="c.widget.service"
                :pt="toValue(c.widget.settings)"
              />
            </slot>
          </template>
        </slot>
      </Group>
    </Group>

    <slot name="footer" v-bind="ctx">
      <Footer v-bind="settings.footer" class="f-system-workspace-footer" />
    </slot>
  </Group>
</template>
