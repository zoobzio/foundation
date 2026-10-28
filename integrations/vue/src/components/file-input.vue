<script lang="ts">
import type {
  FileInputProps,
  FileInputEmits,
  FileInputPassthrough,
  FileInputContext,
  FileInputSlots,
} from "../types/components/file-input";

import { useTemplateRef, watch } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
import { fileKey } from "../utils/file";
</script>

<script setup lang="ts">
const {
  modelValue,
  multiple = false,
  accept,
  capture,
  disabled,
  required,
  name,
  pt,
} = defineProps<FileInputProps>();

const emit = defineEmits<FileInputEmits>();

const el = useTemplateRef<HTMLDivElement>("el");
const input = useTemplateRef<HTMLInputElement>("input");

const $model = useModel<File[]>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { default: [] },
);

/**
 * The native input keeps its own list, which a form reset or a removed
 * item leaves behind. Clearing its value is the one write it allows, so
 * the list is dropped whenever the model no longer matches a native pick.
 */
const clear = () => {
  if (input.value) input.value.value = "";
};

watch($model, (files) => {
  if (files.length === 0) clear();
});

const settings = usePassthrough<FileInputPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    input: {
      type: "file",
      multiple,
      accept,
      capture,
      disabled,
      required,
      name,
      onChange: (event) => {
        if (!(event.target instanceof HTMLInputElement)) return;
        const files = Array.from(event.target.files ?? []);
        $model.value = multiple ? files : files.slice(0, 1);
      },
    },
    item: () => ({}),
    itemRemove: (file) => ({
      type: "button",
      disabled,
      onClick: () => {
        $model.value = $model.value.filter((f) => f !== file);
        clear();
      },
    }),
  },
}));

const ctx = useContext<FileInputContext>("file-input", () => ({
  multiple,
  accept,
  capture,
  disabled,
  required,
  name,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<FileInputSlots>();
</script>

<template>
  <div ref="el" class="f-group f-file-input-root" v-bind="settings.root">
    <slot name="input" v-bind="ctx">
      <input
        ref="input"
        class="f-input f-file-input-input"
        v-bind="settings.input"
      />
    </slot>
    <template v-for="file in $model" :key="fileKey(file)">
      <slot name="item" v-bind="{ ...ctx, file }">
        <div class="f-group f-file-input-item" v-bind="settings.item(file)">
          <slot name="itemName" v-bind="{ ...ctx, file }">
            <span class="f-span f-file-input-item-name">{{ file.name }}</span>
          </slot>
          <slot name="itemRemove" v-bind="{ ...ctx, file }">
            <button
              class="f-button f-file-input-item-remove"
              v-bind="settings.itemRemove(file)"
            >
              <slot name="itemRemoveIcon" v-bind="{ ...ctx, file }">
                <span class="f-span">Remove</span>
              </slot>
            </button>
          </slot>
        </div>
      </slot>
    </template>
  </div>
</template>
