<script setup lang="ts">
import type { TableProps } from "../types/table";

defineProps<TableProps>();

</script>

<template>
  <div class="f-table-wrapper">
    <table class="f-table">
      <slot />
    </table>
  </div>
</template>

