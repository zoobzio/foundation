<script lang="ts">
import type { MarkdownProps } from "#foundation/types/core/markdown";
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { parseMarkdown } from "#foundation/utils/markdown";
import Article from "#foundation/components/common/article.vue";
import MarkdownNode from "#foundation/components/core/MarkdownNode.vue";
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
