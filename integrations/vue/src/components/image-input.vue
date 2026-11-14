<script lang="ts">
import type {
  ImageInputProps,
  ImageInputEmits,
  ImageInputPassthrough,
  ImageInputContext,
  ImageInputSlots,
  ImageInputValue,
} from "../types/components/image-input";

import { shallowRef, toRaw, useId, useTemplateRef, watch } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  accept = "image/*",
  capture,
  alt = "",
  disabled,
  required,
  name,
  pt,
} = defineProps<ImageInputProps>();

const emit = defineEmits<ImageInputEmits>();

const el = useTemplateRef<HTMLDivElement>("el");
const input = useTemplateRef<HTMLInputElement>("input");
const uid = useId();

const $model = useModel<ImageInputValue>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

/**
 * What the preview shows. A stored image is its own URL. A picked file
 * gets an object URL, which holds the file in memory until revoked, so it
 * is revoked when the model moves on and when the component unmounts. A
 * file reaches the model from the browser only, so no object URL is made
 * on the server.
 */
const src = shallowRef<string>();

watch(
  $model,
  (value, _, onCleanup) => {
    if (value instanceof File) {
      // A reactive container may hand the file over as a proxy, which the
      // browser does not take for a Blob.
      const url = URL.createObjectURL(toRaw(value));
      src.value = url;
      onCleanup(() => URL.revokeObjectURL(url));
    } else {
      src.value = value || undefined;
    }
    // The native input keeps its own pick, which a removal, a form reset,
    // or a restore leaves behind. Clearing its value is the one write it
    // allows, and it lets the same file be picked again.
    if (!(value instanceof File) && input.value) input.value.value = "";
  },
  { immediate: true },
);

const settings = usePassthrough<ImageInputPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    preview: { src: src.value, alt },
    placeholder: {},
    input: {
      id: uid,
      type: "file",
      accept,
      capture,
      disabled,
      // A stored image leaves the native input empty, so the native
      // constraint applies only while there is no image at all.
      required: required && !src.value,
      "aria-required": required ? true : undefined,
      name,
      onChange: (event) => {
        if (!(event.target instanceof HTMLInputElement)) return;
        const file = event.target.files?.[0];
        // A cancelled dialog reports no file; the image stays as it is.
        if (file) $model.value = file;
      },
    },
    pick: {},
    remove: {
      type: "button",
      disabled,
      onClick: () => {
        $model.value = undefined;
      },
    },
  },
}));

const ctx = useContext<ImageInputContext>("image-input", () => ({
  accept,
  capture,
  alt,
  disabled,
  required,
  name,
  modelValue: $model,
  src: src.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<ImageInputSlots>();
</script>

<template>
  <div ref="el" class="f-group f-image-input-root" v-bind="settings.root">
    <slot v-if="src" name="preview" v-bind="ctx">
      <img class="f-image-input-preview" v-bind="settings.preview" />
    </slot>
    <slot v-else name="placeholder" v-bind="ctx">
      <div
        class="f-group f-image-input-placeholder"
        v-bind="settings.placeholder"
      >
        <slot name="placeholderContent" v-bind="ctx" />
      </div>
    </slot>
    <slot name="input" v-bind="ctx">
      <input
        ref="input"
        class="f-input f-image-input-input"
        v-bind="settings.input"
      />
    </slot>
    <slot name="pick" v-bind="ctx">
      <!-- The label opens the picker of whichever id the input resolved
           to, so a form field's wiring carries over. -->
      <label
        class="f-label f-image-input-pick"
        :for="settings.input.id"
        v-bind="settings.pick"
      >
        <slot name="pickPrepend" v-bind="ctx" />
        <slot name="pickText" v-bind="ctx">
          <span class="f-span">{{ src ? "Change" : "Choose" }}</span>
        </slot>
        <slot name="pickAppend" v-bind="ctx" />
      </label>
    </slot>
    <slot v-if="src" name="remove" v-bind="ctx">
      <button class="f-button f-image-input-remove" v-bind="settings.remove">
        <slot name="removePrepend" v-bind="ctx" />
        <slot name="removeText" v-bind="ctx">
          <span class="f-span">Remove</span>
        </slot>
        <slot name="removeAppend" v-bind="ctx" />
      </button>
    </slot>
  </div>
</template>
