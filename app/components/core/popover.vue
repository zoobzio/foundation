<script lang="ts">
import type {
  PopoverProps,
  PopoverEmits,
  PopoverPassthrough,
  PopoverContext,
  PopoverSlots,
} from "../../types/core/popover";
import type { ComponentPublicInstance } from "vue";

import {
  PopoverRoot,
  PopoverAnchor,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { POPOVER_SIDE_OFFSET } from "../../constants/popover";
</script>

<script setup lang="ts">
const {
  open = undefined,
  defaultOpen = false,
  modal = false,
  reference,
  side = "bottom",
  align = "center",
  sideOffset = POPOVER_SIDE_OFFSET,
  alignOffset = 0,
  arrow = false,
  pt,
} = defineProps<PopoverProps>();

const emit = defineEmits<PopoverEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: defaultOpen },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<PopoverPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      open: $open.value,
      modal,
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    anchor: { reference },
    trigger: { asChild: true },
    content: { side, align, sideOffset, alignOffset },
    arrow: {},
    close: {},
  },
}));

const ctx = useContext<PopoverContext>("popover", () => ({
  defaultOpen,
  modal,
  reference,
  side,
  align,
  sideOffset,
  alignOffset,
  arrow,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<PopoverSlots>();
</script>

<template>
  <PopoverRoot ref="el" class="f-popover-root" v-bind="settings.root">
    <slot name="anchor" v-bind="ctx">
      <PopoverAnchor
        v-if="reference"
        class="f-popover-anchor"
        v-bind="settings.anchor"
      />
      <PopoverTrigger v-else class="f-popover-trigger" v-bind="settings.trigger">
        <slot name="trigger" v-bind="ctx" />
      </PopoverTrigger>
    </slot>
    <PopoverPortal>
      <PopoverContent class="f-popover-content" v-bind="settings.content">
        <slot name="content" v-bind="ctx" />
        <slot name="arrow" v-bind="ctx">
          <PopoverArrow v-if="arrow" class="f-popover-arrow" v-bind="settings.arrow" />
        </slot>
        <PopoverClose
          v-if="$slots.close"
          class="f-popover-close"
          v-bind="settings.close"
        >
          <slot name="close" v-bind="ctx" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
