<script lang="ts">
import type { HrProps } from "#foundation/types/common/hr";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
defineProps<HrProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <hr ref="el" class="f-hr" >
</template>
