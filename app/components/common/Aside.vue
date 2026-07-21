<script lang="ts">
import type { AsideProps } from "#foundation/types/common/aside";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<AsideProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <aside ref="el" :aria-label="label" class="f-aside">
    <slot>{{ label }}</slot>
  </aside>
</template>
