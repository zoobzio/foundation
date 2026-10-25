<script lang="ts">
import type {
  CodeContext,
  CodeEmits,
  CodePassthrough,
  CodeProps,
  CodeSlots,
} from "../types/components/code";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useRefs } from "../composables/ref";
import { useCode } from "../composables/code";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import {
  CODE_COLUMN_LABEL,
  CODE_EVENTS,
  CODE_LINE_LABEL,
} from "../constants/code";
</script>

<script setup lang="ts" generic="I, O">
const { service, pt } = defineProps<CodeProps<I, O>>();

const emit = defineEmits<CodeEmits>();

useServiceEmits(service, CODE_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");
const content = useTemplateRef<HTMLDivElement>("content");

const { empty, mounted, cursor } = useRefs(service);

const { markup, activate } = useCode(service, content);

const settings = usePassthrough<CodePassthrough>(() => ({
  pt,
  recipes: {
    content: {
      tabindex: 0,
      onPointerdown: activate,
      onFocus: activate,
    },
    status: { role: "status" },
  },
}));

const ctx = useContext<CodeContext<I, O>>("code", () => ({
  code: service,
  el: el.value,
  settings: settings.value,
  activate,
}));

defineExpose({ ctx });
defineSlots<CodeSlots<I, O>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-code"
    :data-empty="empty || undefined"
    :data-mounted="mounted || undefined"
  >
    <div
      ref="content"
      class="f-group f-data-code-content"
      v-bind="settings.content"
      v-html="markup"
    />
    <slot name="status" v-bind="ctx">
      <div class="f-group f-data-code-status" v-bind="settings.status">
        <span
          class="f-data-code-cursor"
          :data-line="cursor.line"
          :data-column="cursor.column"
        >
          {{ CODE_LINE_LABEL }} {{ cursor.line }}, {{ CODE_COLUMN_LABEL }}
          {{ cursor.column }}
        </span>
      </div>
    </slot>
  </div>
</template>
