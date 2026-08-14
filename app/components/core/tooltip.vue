<script lang="ts">
import type {
  TooltipProps,
  TooltipEmits,
  TooltipPassthrough,
  TooltipContext,
  TooltipSlots,
} from "../../types/core/tooltip";
import type { ComponentPublicInstance } from "vue";

import TooltipRoot from "../common/tooltip/root.vue";
import TooltipTrigger from "../common/tooltip/trigger.vue";
import TooltipPortal from "../common/tooltip/portal.vue";
import TooltipContent from "../common/tooltip/content.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { TOOLTIP_SIDE_OFFSET } from "../../constants/tooltip";
</script>

<script setup lang="ts">
const {
  content,
  open = undefined,
  delayDuration = 0,
  side = "bottom",
  align = "center",
  sideOffset = TOOLTIP_SIDE_OFFSET,
  pt,
} = defineProps<TooltipProps>();

const emit = defineEmits<TooltipEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<TooltipPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      open: $open.value,
      delayDuration,
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    trigger: { asChild: true },
    content: { side, align, sideOffset },
  },
}));

const ctx = useContext<TooltipContext>("tooltip", () => ({
  content,
  delayDuration,
  side,
  align,
  sideOffset,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TooltipSlots>();
</script>

<template>
  <TooltipRoot ref="el" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <TooltipTrigger v-bind="settings.trigger">
        <slot v-bind="ctx" />
      </TooltipTrigger>
    </slot>
    <TooltipPortal>
      <slot name="content" v-bind="ctx">
        <TooltipContent v-bind="settings.content">
          {{ content }}
        </TooltipContent>
      </slot>
    </TooltipPortal>
  </TooltipRoot>
</template>
