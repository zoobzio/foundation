<script lang="ts">
import type {
  Slot,
  WorkspaceContext,
  WorkspacePassthrough,
  WorkspaceProps,
  WorkspaceSlots,
} from "../../types/system/workspace";
import type { Widgets } from "../../types/widget";
import type { ComponentPublicInstance } from "vue";

import Footer from "../common/footer.vue";
import Group from "../common/group.vue";
import Header from "../common/header.vue";

import { computed, toValue, useTemplateRef } from "#imports";
import { useWidgets, useWiring } from "../../composables/widgets";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="R extends Widgets">
const { definition, pt } = defineProps<WorkspaceProps<R>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const widgets = useWidgets(definition.widgets);
useWiring(definition.wire, widgets);

// Each grid cell paired with its resolved widget, if the layout assigns one.
const cells = computed(() =>
  definition.layout.slots.map((slot) => {
    const key = slot.widget === undefined ? undefined : String(slot.widget);
    return {
      slot,
      key,
      widget: key === undefined ? undefined : widgets[key],
    };
  }),
);

const gridStyle = computed((): Record<string, string> => ({
  display: "grid",
  "grid-template-columns": `repeat(${definition.layout.columns}, 1fr)`,
  "grid-template-rows": `repeat(${definition.layout.rows}, 1fr)`,
}));

const slotStyle = (slot: Slot<R>): Record<string, string> => ({
  "grid-column": `${slot.position[0] + 1} / span ${slot.span[0]}`,
  "grid-row": `${slot.position[1] + 1} / span ${slot.span[1]}`,
});

const settings = usePassthrough<WorkspacePassthrough<R>>(() => ({
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
  definition,
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
        :key="c.slot.id"
        v-bind="settings.slot(c.slot)"
        class="f-system-workspace-slot"
        :style="slotStyle(c.slot)"
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
