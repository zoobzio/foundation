<script lang="ts">
import { EditorView, lineNumbers as lineNumbersExt, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { foldGutter, foldKeymap } from "@codemirror/language";
import { codeViewTheme } from "#foundation/utils/codemirror-theme";
import { resolveLanguage } from "#foundation/utils/codemirror-lang";
import { codeViewSearch, dispatchSearch, findNextMatch, findPrevMatch } from "#foundation/utils/codemirror-search";
import type { CodeViewProps } from "#foundation/types/core/code-view";
import { onBeforeUnmount, useTemplateRef, watchEffect } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import Group from "#foundation/components/common/group.vue";
</script>

<script setup lang="ts">
const {
  content,
  language,
  lineNumbers = true,
  folding = true,
  wordWrap = false,
  pt,
} = defineProps<CodeViewProps>();

const el = useTemplateRef("el");
const editorEl = useTemplateRef<HTMLElement>("editor");

let activeSearchQuery = "";

const setQuery = (query: string) => {
  activeSearchQuery = query;
  if (view) dispatchSearch(view, query);
};
const nextMatch = () => { if (view) findNextMatch(view); };
const prevMatch = () => { if (view) findPrevMatch(view); };

defineExpose({ el, setQuery, nextMatch, prevMatch });

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const editorPT = usePassthrough(pt?.editor, { props: {}, handlers: {} });

let view: EditorView | null = null;

const buildExtensions = () => {
  const extensions = [
    EditorView.editable.of(false),
    EditorState.readOnly.of(true),
    ...codeViewTheme,
    ...codeViewSearch(),
  ];

  if (lineNumbers) extensions.push(lineNumbersExt());
  if (folding) extensions.push(foldGutter(), keymap.of(foldKeymap));
  if (wordWrap) extensions.push(EditorView.lineWrapping);

  if (language) {
    const lang = resolveLanguage(language);
    if (lang) extensions.push(lang);
  }

  return extensions;
};

watchEffect(() => {
  if (!editorEl.value) return;

  if (view) {
    view.destroy();
    view = null;
  }

  view = new EditorView({
    state: EditorState.create({
      doc: content,
      extensions: buildExtensions(),
    }),
    parent: editorEl.value,
  });

  if (activeSearchQuery) {
    dispatchSearch(view, activeSearchQuery);
  }
});

onBeforeUnmount(() => {
  if (view) {
    view.destroy();
    view = null;
  }
});
</script>

<template>
  <Group ref="el" v-bind="rootPT.props" class="f-code-view" v-on="rootPT.handlers">
    <slot name="root" v-bind="{ content, language }">
      <slot name="editor" v-bind="{ content, language }">
        <div ref="editor" v-bind="editorPT.props" class="f-code-view-editor" v-on="editorPT.handlers" />
      </slot>
    </slot>
  </Group>
</template>
