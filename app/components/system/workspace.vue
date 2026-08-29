<script lang="ts">
import type {
  Slot,
  WorkspaceContext,
  WorkspaceProps,
  WorkspaceSlots,
} from "../../types/system/workspace";
import type { AnyWidget, Widgets } from "../../types/widget";

import { computed, toValue, useTemplateRef } from "#imports";
import { entries } from "objectively";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="R extends Widgets">
const { workspace } = defineProps<WorkspaceProps<R>>();

const el = useTemplateRef<HTMLDivElement>("el");

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

const ctx = useContext<WorkspaceContext<R>>("system-workspace", () => ({
  workspace,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<WorkspaceSlots<R>>();
</script>

<template>
  <div ref="el" class="f-group f-system-workspace">
    <slot name="header" v-bind="ctx">
      <header class="f-header f-system-workspace-header" />
    </slot>

    <div class="f-group f-system-workspace-grid" :style="gridStyle">
      <div
        v-for="c in cells"
        :key="c.id"
        class="f-group f-system-workspace-slot"
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
      </div>
    </div>

    <slot name="footer" v-bind="ctx">
      <footer class="f-footer f-system-workspace-footer" />
    </slot>
  </div>
</template>
