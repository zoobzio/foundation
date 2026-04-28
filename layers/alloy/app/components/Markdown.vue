<script lang="ts">
import type { MarkdownProps } from "../types/markdown";
</script>

<script setup lang="ts">
const { content, pt } = defineProps<MarkdownProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });

const tree = computed(() => parseMarkdown(content));

const ctx = computed(() => ({ content, tree: tree.value }));
</script>

<template>
  <Article ref="el" v-bind="rootPT.props" class="f-markdown" v-on="rootPT.handlers">
    <slot name="root" v-bind="ctx">
      <MarkdownNode :node="tree" :pt="pt" />
    </slot>
  </Article>
</template>
