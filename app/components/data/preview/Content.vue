<script lang="ts">
import type { DataPreviewContentProps } from "#foundation/types/data/preview-content";
</script>

<script setup lang="ts" generic="T">
import { computed, ref, useTemplateRef, watch } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import Chip from "#foundation/components/common/Chip.vue";
import CodeView from "#foundation/components/common/CodeView.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Group from "#foundation/components/common/Group.vue";
import Input from "#foundation/components/common/Input.vue";
import Scroller from "#foundation/components/core/Scroller.vue";
import Span from "#foundation/components/common/Span.vue";
const { preview, pt } = defineProps<DataPreviewContentProps<T>>();

const el = useTemplateRef("el");
const codeViewRef = useTemplateRef<{
  setQuery: (query: string) => void;
  nextMatch: () => void;
  prevMatch: () => void;
}>("codeView");
defineExpose({ el });

const { content } = preview;

const searchQuery = ref("");

watch(searchQuery, (q) => {
  codeViewRef.value?.setQuery(q);
});

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const footerPT = usePassthrough(pt?.footer, { props: {}, handlers: {} });
const languageBadgePT = usePassthrough(pt?.languageBadge, () => ({
  props: { label: content.type === "code" ? content.language : content.type },
  handlers: {},
}));
const searchPT = usePassthrough(pt?.search, () => ({
  props: { placeholder: "Search...", type: "search" as const },
  handlers: {},
}));
const infoPT = usePassthrough(pt?.info, { props: {}, handlers: {} });
const scrollerPT = usePassthrough(pt?.scroller, { props: {}, handlers: {} });
const codeViewPT = usePassthrough(pt?.codeView, () => ({
  props: {
    content: preview.contentValue.value,
    language: content.type === "code" ? content.language : undefined,
  },
  handlers: {},
}));

// Derived info
const lineCount = computed(() => {
  const val = preview.contentValue.value;
  if (!val) return 0;
  return val.split("\n").length;
});

const byteSize = computed(() => {
  const val = preview.contentValue.value;
  if (!val) return "0 B";
  const bytes = new Blob([val]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
});

const goToNext = () => codeViewRef.value?.nextMatch();
const goToPrev = () => codeViewRef.value?.prevMatch();

const ctx = computed(() => ({
  lineCount: lineCount.value,
  byteSize: byteSize.value,
  searchQuery: searchQuery.value,
  goToNext,
  goToPrev,
}));
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-preview-content"
    v-on="rootPT.handlers"
  >
    <slot name="content" v-bind="{ content, contentValue: preview.contentValue.value }">
      <Scroller
        v-bind="scrollerPT.props"
        class="f-data-preview-content-scroller"
        v-on="scrollerPT.handlers"
      >
        <template #content>
          <CodeView
            v-if="content.type === 'code'"
            ref="codeView"
            v-bind="codeViewPT.props"
            class="f-data-preview-content-code-view"
            v-on="codeViewPT.handlers"
          />
        </template>
      </Scroller>
    </slot>

    <slot name="footer" v-bind="ctx">
      <Group
        v-bind="footerPT.props"
        class="f-data-preview-content-footer"
        v-on="footerPT.handlers"
      >
        <slot name="search" v-bind="ctx">
          <Group class="f-data-preview-content-search">
            <Input
              v-bind="searchPT.props"
              class="f-data-preview-content-search-input"
              v-on="searchPT.handlers"
              @input="searchQuery = ($event.target as HTMLInputElement).value"
            />
            <Fab icon="chevron-up" :disabled="!searchQuery" @click="goToPrev" />
            <Fab icon="chevron-down" :disabled="!searchQuery" @click="goToNext" />
          </Group>
        </slot>

        <slot name="info" v-bind="ctx">
          <Span
            v-bind="infoPT.props"
            class="f-data-preview-content-info"
            v-on="infoPT.handlers"
          >
            {{ lineCount }} lines · {{ byteSize }}
          </Span>
        </slot>

        <slot name="languageBadge" v-bind="ctx">
          <Chip
            v-bind="languageBadgePT.props"
            class="f-data-preview-content-language"
            v-on="languageBadgePT.handlers"
          />
        </slot>
      </Group>
    </slot>
  </Group>
</template>
