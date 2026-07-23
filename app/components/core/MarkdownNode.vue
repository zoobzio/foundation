<script lang="ts">
import type { MarkdownPassthrough, MarkdownNode } from "#foundation/types/core/markdown";
import { computed } from "#imports";
import Anchor from "#foundation/components/common/anchor.vue";
import Blockquote from "#foundation/components/common/blockquote.vue";
import Code from "#foundation/components/common/code.vue";
import Del from "#foundation/components/common/del.vue";
import Em from "#foundation/components/common/em.vue";
import H1 from "#foundation/components/common/h1.vue";
import H2 from "#foundation/components/common/h2.vue";
import H3 from "#foundation/components/common/h3.vue";
import H4 from "#foundation/components/common/h4.vue";
import H5 from "#foundation/components/common/h5.vue";
import H6 from "#foundation/components/common/h6.vue";
import Hr from "#foundation/components/common/hr.vue";
import Img from "#foundation/components/common/img.vue";
import Li from "#foundation/components/common/li.vue";
import MarkdownCode from "#foundation/components/core/MarkdownCode.vue";
import Ol from "#foundation/components/common/ol.vue";
import P from "#foundation/components/common/p.vue";
import Strong from "#foundation/components/common/strong.vue";
import Table from "#foundation/components/common/table.vue";
import Tbody from "#foundation/components/common/tbody.vue";
import Td from "#foundation/components/common/td.vue";
import Thead from "#foundation/components/common/thead.vue";
import Tr from "#foundation/components/common/tr.vue";
import Ul from "#foundation/components/common/ul.vue";
</script>

<script setup lang="ts">
const { node, pt } = defineProps<{
  node: MarkdownNode;
  pt?: MarkdownPassthrough;
}>();

const children = computed(() =>
  "children" in node ? node.children : [],
);

const tableHead = computed(() => children.value.at(0));
const tableBody = computed(() => children.value.slice(1));
</script>

<template>
  <template v-if="node.type === 'root'">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </template>

  <H1 v-else-if="node.type === 'heading' && node.depth === 1" v-bind="pt?.h1?.props" class="f-markdown-h1" v-on="pt?.h1?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </H1>
  <H2 v-else-if="node.type === 'heading' && node.depth === 2" v-bind="pt?.h2?.props" class="f-markdown-h2" v-on="pt?.h2?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </H2>
  <H3 v-else-if="node.type === 'heading' && node.depth === 3" v-bind="pt?.h3?.props" class="f-markdown-h3" v-on="pt?.h3?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </H3>
  <H4 v-else-if="node.type === 'heading' && node.depth === 4" v-bind="pt?.h4?.props" class="f-markdown-h4" v-on="pt?.h4?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </H4>
  <H5 v-else-if="node.type === 'heading' && node.depth === 5" v-bind="pt?.h5?.props" class="f-markdown-h5" v-on="pt?.h5?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </H5>
  <H6 v-else-if="node.type === 'heading' && node.depth === 6" v-bind="pt?.h6?.props" class="f-markdown-h6" v-on="pt?.h6?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </H6>

  <P v-else-if="node.type === 'paragraph'" v-bind="pt?.p?.props" class="f-markdown-p" v-on="pt?.p?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </P>

  <Strong v-else-if="node.type === 'strong'" v-bind="pt?.strong?.props" class="f-markdown-strong" v-on="pt?.strong?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Strong>

  <Em v-else-if="node.type === 'emphasis'" v-bind="pt?.em?.props" class="f-markdown-em" v-on="pt?.em?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Em>

  <Del v-else-if="node.type === 'delete'" v-bind="pt?.del?.props" class="f-markdown-del" v-on="pt?.del?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Del>

  <Blockquote v-else-if="node.type === 'blockquote'" v-bind="pt?.blockquote?.props" class="f-markdown-blockquote" v-on="pt?.blockquote?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Blockquote>

  <Ul v-else-if="node.type === 'list' && !node.ordered" v-bind="pt?.ul?.props" class="f-markdown-ul" v-on="pt?.ul?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Ul>
  <Ol v-else-if="node.type === 'list' && node.ordered" v-bind="pt?.ol?.props" class="f-markdown-ol" v-on="pt?.ol?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Ol>

  <Li v-else-if="node.type === 'listItem'" v-bind="pt?.li?.props" class="f-markdown-li" v-on="pt?.li?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Li>

  <Anchor v-else-if="node.type === 'link'" v-bind="pt?.anchor?.props" class="f-markdown-a" :to="node.url" :title="node.title ?? undefined" v-on="pt?.anchor?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Anchor>

  <Img v-else-if="node.type === 'image'" v-bind="pt?.img?.props" class="f-markdown-img" :src="node.url" :alt="node.alt ?? undefined" v-on="pt?.img?.handlers ?? {}" />

  <Code v-else-if="node.type === 'inlineCode'" v-bind="pt?.code?.props" class="f-markdown-code" v-on="pt?.code?.handlers ?? {}">{{ node.value }}</Code>

  <MarkdownCode v-else-if="node.type === 'code'" :code="node.value" :lang="node.lang ?? undefined" :pt="pt" />

  <Hr v-else-if="node.type === 'thematicBreak'" v-bind="pt?.hr?.props" class="f-markdown-hr" v-on="pt?.hr?.handlers ?? {}" />

  <Table v-else-if="node.type === 'table'" v-bind="pt?.table?.props" class="f-markdown-table" v-on="pt?.table?.handlers ?? {}">
    <Thead v-if="tableHead" v-bind="pt?.thead?.props" class="f-markdown-thead" v-on="pt?.thead?.handlers ?? {}">
      <MarkdownNode :node="tableHead" :pt="pt" />
    </Thead>
    <Tbody v-if="tableBody.length > 0" v-bind="pt?.tbody?.props" class="f-markdown-tbody" v-on="pt?.tbody?.handlers ?? {}">
      <MarkdownNode v-for="(child, i) in tableBody" :key="i" :node="child" :pt="pt" />
    </Tbody>
  </Table>

  <Tr v-else-if="node.type === 'tableRow'" v-bind="pt?.tr?.props" class="f-markdown-tr" v-on="pt?.tr?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Tr>

  <Td v-else-if="node.type === 'tableCell'" v-bind="pt?.td?.props" class="f-markdown-td" v-on="pt?.td?.handlers ?? {}">
    <MarkdownNode v-for="(child, i) in children" :key="i" :node="child" :pt="pt" />
  </Td>

  <template v-else-if="node.type === 'text'">{{ node.value }}</template>

  <br v-else-if="node.type === 'break'">
</template>
