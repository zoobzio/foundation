<script lang="ts">
import { PopoverRoot, PopoverAnchor, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow, PopoverClose } from "reka-ui";
import type { PopoverProps, PopoverEmits } from "../types/popover";
import type { ReferenceElement } from "reka-ui";
</script>

<script setup lang="ts">
const {
  open,
  reference,
  defaultOpen = false,
  modal = false,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  alignOffset = 0,
  arrow = false,
  pt,
} = defineProps<
  PopoverProps & { reference?: ReferenceElement }
>();

const emit = defineEmits<PopoverEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, () => ({
  props: { open, defaultOpen, modal },
  handlers: { "update:open": (v: boolean) => { emit("update:open", v); } },
}));
const anchorPT = usePassthrough(pt?.anchor, {
  props: { ...(reference ? { reference } : {}) },
  handlers: {},
});
const contentPT = usePassthrough(pt?.content, {
  props: { side, align, sideOffset, alignOffset },
  handlers: {},
});
const arrowPT = usePassthrough(pt?.arrow, { props: {}, handlers: {} });
const closePT = usePassthrough(pt?.close, { props: {}, handlers: {} });

const ctx = computed(() => ({ open, defaultOpen, modal, side, align, sideOffset, alignOffset, arrow }));
</script>

<template>
  <PopoverRoot ref="el" v-bind="rootPT.props" v-on="rootPT.handlers">
    <slot name="anchor" v-bind="ctx">
      <PopoverAnchor v-if="reference" v-bind="anchorPT.props" v-on="anchorPT.handlers" />
      <PopoverTrigger v-else as-child>
        <slot name="trigger" v-bind="ctx" />
      </PopoverTrigger>
    </slot>
    <PopoverPortal>
      <PopoverContent
        v-bind="contentPT.props"
        class="f-popover-content"
        v-on="contentPT.handlers"
      >
        <slot name="content" v-bind="ctx" />
        <slot name="arrow" v-bind="ctx">
          <PopoverArrow
            v-if="arrow"
            v-bind="arrowPT.props"
            class="f-popover-arrow"
            v-on="arrowPT.handlers"
          />
        </slot>
        <PopoverClose
          v-if="$slots.close"
          v-bind="closePT.props"
          class="f-popover-close"
          v-on="closePT.handlers"
        >
          <slot name="close" v-bind="ctx" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
