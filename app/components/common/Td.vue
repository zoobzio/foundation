<script lang="ts">
import type { TdProps } from "#foundation/types/common/td";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<TdProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <td ref="el" class="f-td">
    <slot>{{ label }}</slot>
  </td>
</template>
