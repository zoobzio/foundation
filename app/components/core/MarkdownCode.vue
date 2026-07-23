<script lang="ts">
import type { MarkdownPassthrough } from "#foundation/types/core/markdown";
import { useHighlight } from "#foundation/composables/highlight";
import Code from "#foundation/components/common/code.vue";
import Pre from "#foundation/components/common/pre.vue";
</script>

<script setup lang="ts">
const { code, lang, pt } = defineProps<{
  code: string;
  lang?: string;
  pt?: MarkdownPassthrough;
}>();

const highlighted = useHighlight(() => code, () => lang ?? "");
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- highlighted output from syntax highlighter is safe -->
  <Pre v-bind="pt?.pre?.props" class="f-markdown-pre" :data-language="lang" v-on="pt?.pre?.handlers ?? {}"><code v-if="highlighted" v-bind="pt?.code?.props" class="f-markdown-code" v-on="pt?.code?.handlers ?? {}" v-html="highlighted" /><Code v-else v-bind="pt?.code?.props" class="f-markdown-code" v-on="pt?.code?.handlers ?? {}">{{ code }}</Code></Pre>
</template>
