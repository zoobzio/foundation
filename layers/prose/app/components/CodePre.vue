<script lang="ts">
import type { CodePreProps } from "../types/code-pre";
</script>

<script setup lang="ts">
const { code } = defineProps<CodePreProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const copied = ref(false);

const copyCode = async () => {
  await navigator.clipboard.writeText(code);

  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const ctx = computed(() => ({ code, copied: copied.value }));
</script>

<template>
  <Pre ref="el">
    <Fab class="f-prose-pre" :disabled="copied" :icon="copied ? 'check' : 'copy'" label="Copy code" @click="copyCode" />
    <slot v-bind="ctx" />
  </Pre>
</template>

<style>
.f-pre {
  position: relative;
}

.f-pre .f-prose-pre {
  position: absolute;
  top: var(--ref-spacing-xs);
  right: var(--ref-spacing-xs);
}

@media (max-width: 1024px) {
  .f-pre .f-prose-pre {
    display: none;
  }
}
</style>
