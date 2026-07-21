<script lang="ts">
import type { AnchorProps } from "#foundation/types/common/anchor";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label, to, external, target, replace, prefetch, disabled, ariaCurrent } =
  defineProps<AnchorProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <NuxtLink
    ref="el"
    :to="disabled ? undefined : to"
    :external="external"
    :target="target"
    :replace="replace"
    :prefetch="prefetch"
    :aria-label="label"
    :aria-disabled="disabled"
    :aria-current="ariaCurrent || (disabled ? 'page' : undefined)"
    class="f-a"
  >
    <slot>
      {{ label }}
    </slot>
  </NuxtLink>
</template>
