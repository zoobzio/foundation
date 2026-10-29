<script lang="ts">
import type {
  EditorContext,
  EditorEmits,
  EditorPassthrough,
  EditorProps,
  EditorSlots,
} from "../types/components/editor";

import { useTemplateRef } from "vue";
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

const { markup, tools, activate } = useEditor(service, content);

const settings = usePassthrough<EditorPassthrough>(() => ({
  pt,
  recipes: {
    toolbar: { role: "toolbar" },
    tool: (tool) => ({
      type: "button",
      "aria-pressed": tool.active,
      disabled: tool.disabled,
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

const ctx = useContext<EditorContext<I, O>>("editor", () => ({
  editor: service,
  tools: tools.value,
  el: el.value,
  settings: settings.value,
  activate,
}));

defineExpose({ ctx });
defineSlots<EditorSlots<I, O>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-editor"
    :data-empty="empty || undefined"
    :data-mounted="mounted || undefined"
  >
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-editor-toolbar" v-bind="settings.toolbar">
        <template v-for="tool in tools" :key="tool.key">
          <slot name="tool" v-bind="{ ...ctx, tool }">
            <button
              class="f-button f-data-editor-tool"
              :data-tool="tool.key"
              v-bind="settings.tool(tool)"
            >
              <slot name="toolPrepend" v-bind="{ ...ctx, tool }" />
              {{ tool.label }}
              <slot name="toolAppend" v-bind="{ ...ctx, tool }" />
            </button>
          </slot>
        </template>
      </div>
    </slot>
    <div
      ref="content"
      class="f-group f-data-editor-content"
      v-bind="settings.content"
      v-html="markup"
    />
  </div>
</template>
