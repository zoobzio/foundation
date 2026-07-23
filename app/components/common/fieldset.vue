<script lang="ts">
import type {
  FieldsetBindings,
  FieldsetContext,
  FieldsetProps,
  FieldsetSlots,
} from "#foundation/types/common/fieldset";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { legend, disabled, modifiers, tokens, aria } =
  defineProps<FieldsetProps>();

defineSlots<FieldsetSlots>();

const el = useTemplateRef<HTMLFieldSetElement>("el");

const bindings = computed<FieldsetBindings>(() =>
  useBindings<"fieldset">(modifiers, tokens, aria),
);

const ctx = computed<FieldsetContext>(() => ({
  legend,
  disabled,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <fieldset ref="el" :disabled="disabled" class="f-fieldset" v-bind="bindings">
    <legend v-if="legend" class="f-fieldset-legend">{{ legend }}</legend>
    <slot :ctx="ctx" />
  </fieldset>
</template>
