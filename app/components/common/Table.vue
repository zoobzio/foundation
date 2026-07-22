<script lang="ts">
import type { TableProps } from "#foundation/types/common/table";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<TableProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div class="f-table-wrapper">
    <table ref="el" :aria-label="label" class="f-table">
      <slot />
    </table>
  </div>
</template>
