<script lang="ts">
import type {
  EditorContext,
  EditorEmits,
  EditorPassthrough,
  EditorProps,
  EditorSlots,
} from "../types/components/editor";

import Fab from "./fab.vue";
import Menu from "./menu.vue";
import Primitive from "./primitive.vue";

import { ToolbarButton, ToolbarRoot, ToolbarSeparator } from "reka-ui";

import { computed, useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useRefs } from "../composables/ref";
import { useEditor } from "../composables/editor";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { EDITOR_EVENTS } from "../constants/editor";
</script>

<script setup lang="ts" generic="I, O">
const { service, pt } = defineProps<EditorProps<I, O>>();

const emit = defineEmits<EditorEmits>();

useServiceEmits(service, EDITOR_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");
const content = useTemplateRef<HTMLDivElement>("content");

const { empty, mounted } = useRefs(service);

const { markup, tools, groups, blocks, block, activate } = useEditor(
  service,
  content,
);

/**
 * Applies a picked block type: the heading tool it names, or, for the
 * paragraph, the active heading tool again, which toggles it off. A pick
 * of the block already at the selection changes nothing.
 */
const pick = (picked: { value: string }): void => {
  const target = tools.value.find((tool) => tool.key === picked.value);
  const current = tools.value.find(
    (tool) => tool.group === "headings" && tool.active,
  );
  activate();
  if (target && !target.active) target.run();
  else if (!target && current) current.run();
};

/** Whether no heading would apply at the selection: the dropdown is off. */
const blocksDisabled = computed(() =>
  blocks.value.slice(1).every((entry) => entry.disabled),
);

const settings = usePassthrough<EditorPassthrough>(() => ({
  pt,
  recipes: {
    toolbar: {},
    separator: () => ({}),
    block: {
      as: Menu,
      label: block.value.label,
      groups: [{ key: "blocks", items: blocks.value }],
      align: "start",
      onSelect: pick,
      pt: {
        // The Menu's own idiom for an inert dropdown, so a layer's
        // `block.pt.trigger.disabled` turns it off the same way.
        trigger: { disabled: blocksDisabled.value },
        item: (item) => ({
          "data-block": item.value,
          "data-current": item.value === block.value.value ? "" : undefined,
        }),
        content: {
          // Focus goes back to the document, not to the trigger, once the
          // dropdown closes: the pick applied there.
          onCloseAutoFocus: (event: Event) => {
            event.preventDefault();
            service.focus();
          },
        },
      },
    },
    tool: (tool) => ({
      as: Fab,
      class: "f-data-editor-tool",
      "data-tool": tool.key,
      "data-group": tool.group,
      label: tool.label,
      type: "button",
      "aria-pressed": tool.kind === "toggle" ? tool.active : undefined,
      disabled: tool.disabled,
      // The press must not take focus from the document: with the default
      // the button focuses on mousedown, the editor blurs, and the
      // selection the command applies to collapses out of view.
      onMousedown: (event: MouseEvent) => event.preventDefault(),
      onClick: () => {
        activate();
        tool.run();
        service.focus();
      },
    }),
    content: {
      tabindex: 0,
      onPointerdown: activate,
      onFocus: activate,
    },
  },
}));

/** Whether the dropdown is off, as resolved: the editor's own or a layer's. */
const blockDisabled = computed(
  () => settings.value.block.pt?.trigger?.disabled === true,
);

const ctx = useContext<EditorContext<I, O>>("editor", () => ({
  editor: service,
  tools: tools.value,
  groups: groups.value,
  blocks: blocks.value,
  block: block.value,
  el: el.value,
  settings: settings.value,
  activate,
}));

defineExpose({ ctx });
const slots = defineSlots<EditorSlots<I, O>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-editor"
    :data-empty="empty || undefined"
    :data-mounted="mounted || undefined"
  >
    <slot name="toolbar" v-bind="ctx">
      <ToolbarRoot
        class="f-group f-data-editor-toolbar"
        v-bind="settings.toolbar"
      >
        <template v-for="(group, index) in groups" :key="group.name">
          <slot v-if="index > 0" name="separator" v-bind="{ ...ctx, group }">
            <ToolbarSeparator
              class="f-data-editor-separator"
              v-bind="settings.separator(group)"
            />
          </slot>
          <slot
            v-if="group.name === 'headings'"
            name="block"
            v-bind="{ ...ctx, group }"
          >
            <Primitive v-bind="settings.block">
              <template #default="menu">
                <ToolbarButton as-child :disabled="blockDisabled">
                  <button
                    type="button"
                    class="f-button f-data-editor-block"
                    :data-block="block.value"
                  >
                    <slot name="blockLabel" v-bind="{ ...ctx, menu }">
                      <span class="f-span">{{ block.label }}</span>
                    </slot>
                    <slot name="blockAppend" v-bind="{ ...ctx, menu }" />
                  </button>
                </ToolbarButton>
              </template>
              <template v-if="slots.blockItemLabel" #itemLabel="scope">
                <slot
                  name="blockItemLabel"
                  v-bind="{ ...ctx, menu: scope, item: scope.item }"
                />
              </template>
            </Primitive>
          </slot>
          <template v-else>
            <template v-for="tool in group.tools" :key="tool.key">
              <slot name="tool" v-bind="{ ...ctx, tool }">
                <ToolbarButton
                  as-child
                  :disabled="settings.tool(tool).disabled"
                >
                  <Primitive v-bind="settings.tool(tool)">
                    <slot name="toolPrepend" v-bind="{ ...ctx, tool }" />
                    <slot name="toolLabel" v-bind="{ ...ctx, tool }">
                      <span class="f-span">{{ tool.label }}</span>
                    </slot>
                    <slot name="toolAppend" v-bind="{ ...ctx, tool }" />
                  </Primitive>
                </ToolbarButton>
              </slot>
            </template>
          </template>
        </template>
      </ToolbarRoot>
    </slot>
    <div
      ref="content"
      class="f-group f-data-editor-content"
      v-bind="settings.content"
      v-html="markup"
    />
  </div>
</template>
