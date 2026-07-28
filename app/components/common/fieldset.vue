<script lang="ts">
import type {
  FieldsetContext,
  FieldsetProps,
  FieldsetSlots,
} from "#foundation/types/common/fieldset";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { legend, disabled, modifiers, tokens, aria } =
  defineProps<FieldsetProps>();

const el = useTemplateRef<HTMLFieldSetElement>("el");

const bindings = useBindings<"fieldset">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<FieldsetContext>("fieldset", () => ({
  legend,
  disabled,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<FieldsetSlots>();
</script>

<template>
  <fieldset ref="el" :disabled="disabled" class="f-fieldset" v-bind="bindings">
    <legend v-if="legend" class="f-fieldset-legend">{{ legend }}</legend>
    <slot v-bind="ctx" />
  </fieldset>
</template>
