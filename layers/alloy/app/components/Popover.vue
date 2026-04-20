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
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        v-bind="pt?.content"
        class="f-popover-content"
      >
        <slot name="content" v-bind="ctx" />
        <PopoverArrow
          v-if="arrow"
          v-bind="pt?.arrow"
          class="f-popover-arrow"
        />
        <PopoverClose
          v-if="$slots.close"
          v-bind="pt?.close"
          class="f-popover-close"
        >
          <slot name="close" v-bind="ctx" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

