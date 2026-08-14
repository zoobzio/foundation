<script lang="ts">
import type {
  DialogRootContext,
  DialogRootEmits,
  DialogRootProps,
  DialogRootSlots,
} from "../../../types/common/dialog/root";
import type { ComponentPublicInstance } from "vue";

import { DialogRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  open = undefined,
  defaultOpen = false,
  ...rest
} = defineProps<DialogRootProps>();

const emit = defineEmits<DialogRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: defaultOpen },
);

const forward = useForwardProps(rest);

const ctx = useContext<DialogRootContext>("dialog-root", () => ({
  ...forward.value,
  defaultOpen,
  open: $open,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DialogRootSlots>();
</script>

<template>
  <DialogRoot
    ref="el"
    v-model:open="$open"
    class="f-dialog-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </DialogRoot>
</template>
