<script lang="ts">
import type { ImgProps } from "#foundation/types/common/img";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { src, alt } = defineProps<ImgProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <img ref="el" :src="src" :alt="alt" class="f-img" >
</template>
