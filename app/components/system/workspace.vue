<script lang="ts">
import type {
  Slot,
  WorkspaceContext,
  WorkspacePassthrough,
  WorkspaceProps,
  WorkspaceSlots,
} from "../../types/system/workspace";
import type { AnyWidget, Widgets } from "../../types/widget";
import type { ComponentPublicInstance } from "vue";

import Footer from "../common/footer.vue";
import Group from "../common/group.vue";
import Header from "../common/header.vue";

import { computed, toValue, useTemplateRef } from "#imports";
import { entries } from "objectively";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="R extends Widgets">
const { workspace, pt } = defineProps<WorkspaceProps<R>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

// Each grid cell paired with its instanced widget, if one shares its id.
// The widening assignment is the erasure boundary: the render path drops to
// the erased record — correlation was proven where each widget was
// instanced.
const cells = computed(() => {
  const widgets: Record<string, AnyWidget> = workspace.widgets;
  return entries(workspace.layout.slots).map(([id, slot]) => ({
    id,
    slot,
    widget: widgets[id],
  }));
});

const gridStyle = computed((): Record<string, string> => ({
  display: "grid",
  "grid-template-columns": `repeat(${workspace.layout.columns}, 1fr)`,
  "grid-template-rows": `repeat(${workspace.layout.rows}, 1fr)`,
}));

const slotStyle = (slot: Slot): Record<string, string> => ({
  "grid-column": `${slot.position[0] + 1} / span ${slot.span[0]}`,
  "grid-row": `${slot.position[1] + 1} / span ${slot.span[1]}`,
});

const settings = usePassthrough<WorkspacePassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    header: {},
    grid: {},
    slot: () => ({}),
    footer: {},
  },
}));

const ctx = useContext<WorkspaceContext<R>>("system-workspace", () => ({
  workspace,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<WorkspaceSlots<R>>();
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
        :key="c.id"
        v-bind="settings.slot({ id: c.id, ...c.slot })"
        class="f-system-workspace-slot"
        :style="slotStyle(c.slot)"
      >
        <slot :name="`slot:${c.id}`" v-bind="{ ...ctx, id: c.id, slot: c.slot }">
          <template v-if="c.widget">
            <slot
              :name="`widget:${c.id}`"
              v-bind="{ ...ctx, id: c.id, slot: c.slot, service: c.widget.service }"
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
