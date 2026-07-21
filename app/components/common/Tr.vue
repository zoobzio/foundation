<script lang="ts">
import type { TrProps } from "#foundation/types/common/tr";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
defineProps<TrProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <tr ref="el" class="f-tr">
    <slot />
  </tr>
</template>
