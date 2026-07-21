<script lang="ts">
import type { TbodyProps } from "#foundation/types/common/tbody";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
defineProps<TbodyProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <tbody ref="el" class="f-tbody">
    <slot />
  </tbody>
</template>
