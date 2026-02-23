<script setup lang="ts">
import type { TbodyProps } from "../types/tbody";

defineProps<TbodyProps>();

</script>

<template>
  <tbody class="f-tbody">
    <slot />
  </tbody>
</template>

