<script lang="ts">
import type {
  RichTextContext,
  RichTextEmits,
  RichTextPassthrough,
  RichTextProps,
  RichTextSlots,
} from "../types/components/rich-text";
import type { EditorEmits, EditorProps } from "../types/components/editor";
import type { Context } from "../types/context";
import type { Passthrough } from "../types/passthrough";
import type { VNodeProps } from "vue";

import Editor from "./editor.vue";

import { onBeforeUnmount, reactive, shallowRef, useId, watch } from "vue";
import { EditorService, createEditorState, html } from "@zoobzio/editor";
import { useContext } from "../composables/context";
import { useForward } from "../composables/forward";
import { useModel } from "../composables/model";
import { usePassthrough } from "../composables/passthrough";
</script>

<script setup lang="ts">
const {
  modelValue,
  id,
  features = {},
  disabled,
  required,
  pt,
} = defineProps<RichTextProps>();

const emit = defineEmits<RichTextEmits>();

const slots = defineSlots<RichTextSlots>();

const $model = useModel<string>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { default: "" },
);

const uid = useId();
const service = new EditorService<string, string>(
  id ?? uid,
  features,
  reactive(createEditorState()),
  html,
);

let synced = $model.value;
service.load(synced);

watch($model, (value) => {
  if (value === synced) return;
  synced = value;
  service.load(value);
});

service.on("updated", () => {
  synced = service.empty ? "" : service.document;
  $model.value = synced;
});

onBeforeUnmount(() => {
  service.destroy();
});

const layered = usePassthrough<RichTextPassthrough>(() => ({
  pt,
  layer: {
    content: {
      "aria-required": required || undefined,
      "aria-disabled": disabled || undefined,
      onBlur: (event: FocusEvent) => emit("blur", event),
      ...(disabled
        ? {
            tabindex: -1,
            onPointerdown: (event: PointerEvent) => event.preventDefault(),
            onFocus: () => {},
          }
        : {}),
    },
    ...(disabled ? { tool: () => ({ disabled: true }) } : {}),
  },
}));

const el = shallowRef<{ ctx: Context<RichTextContext> } | null>(null);

const ctx = useContext(() => el.value?.ctx);

const Core = useForward<
  Passthrough<EditorProps<string, string>, EditorEmits> & VNodeProps
>({
  component: Editor,
  props: () => ({ service, pt: layered.value, ref: el }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Core />
</template>
