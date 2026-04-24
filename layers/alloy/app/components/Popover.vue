<script lang="ts">
import { PopoverRoot, PopoverAnchor, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow, PopoverClose } from "reka-ui";
import type { PopoverProps } from "../types/popover";
import type { ReferenceElement } from "reka-ui";
</script>

<script setup lang="ts">
const {
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
  Omit<PopoverProps, "open"> & { reference?: ReferenceElement }
>();

const open = defineModel<boolean>("open", { default: false });

const el = useTemplateRef("el");
defineExpose({ el });

const contentPT = usePassthrough(pt?.content, {
  props: { side, align, sideOffset, alignOffset },
});
const arrowPT = usePassthrough(pt?.arrow, {});
const closePT = usePassthrough(pt?.close, {});

const ctx = computed(() => ({ open: open.value, defaultOpen, modal, side, align, sideOffset, alignOffset, arrow }));
</script>

<template>
  <PopoverRoot ref="el" v-model:open="open" :default-open="defaultOpen" :modal="modal">
    <PopoverAnchor v-if="reference" :reference="reference" />
    <PopoverTrigger v-else as-child>
      <slot v-bind="ctx" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        v-bind="contentPT.props"
        v-on="contentPT.handlers"
        class="f-popover-content"
      >
        <slot name="content" v-bind="ctx" />
        <PopoverArrow
          v-if="arrow"
          v-bind="arrowPT.props"
          v-on="arrowPT.handlers"
          class="f-popover-arrow"
        />
        <PopoverClose
          v-if="$slots.close"
          v-bind="closePT.props"
          v-on="closePT.handlers"
          class="f-popover-close"
        >
          <slot name="close" v-bind="ctx" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
