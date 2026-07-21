<script lang="ts">
import type { FieldsetProps } from "#foundation/types/common/fieldset";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { legend } = defineProps<FieldsetProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <fieldset ref="el" :disabled="disabled" class="f-fieldset">
    <legend v-if="legend" class="f-fieldset-legend">{{ legend }}</legend>
    <slot />
  </fieldset>
</template>
