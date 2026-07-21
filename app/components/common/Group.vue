<script lang="ts">
import type { GroupProps } from "#foundation/types/common/group";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<GroupProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :aria-label="label" class="f-group">
    <slot>{{ label }}</slot>
  </div>
</template>
