<script lang="ts">
import type { DataPreviewProps } from "#foundation/types/data/preview-widget";
</script>

<script setup lang="ts" generic="T">
import { computed, useId, useLazyAsyncData, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import DataPreviewContent from "#foundation/components/data/preview/Content.vue";
import DataPreviewFields from "#foundation/components/data/preview/Fields.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Group from "#foundation/components/common/Group.vue";
import Span from "#foundation/components/common/Span.vue";
const { preview, pt } = defineProps<DataPreviewProps<T>>();

useLazyAsyncData(`init-preview-${useId()}`, preview.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const { content } = preview;

const ctx = computed(() => ({ preview }));

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const toolbarPT = usePassthrough(pt?.toolbar, { props: {}, handlers: {} });
const titlePT = usePassthrough(pt?.title, { props: {}, handlers: {} });
const bodyPT = usePassthrough(pt?.body, { props: {}, handlers: {} });

// File actions — live at widget level
const copyAll = async () => {
  await navigator.clipboard.writeText(preview.contentValue.value);
};

const download = () => {
  const val = preview.contentValue.value;
  const ext = content.type === "code" ? content.language : "txt";
  const filename = (content.type === "code" && content.filename) ? content.filename : `content.${ext}`;
  const blob = new Blob([val], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const openExternal = () => {
  if (content.type === "code" && content.externalUrl) {
    window.open(content.externalUrl, "_blank");
  }
};

const filename = computed(() => {
  if (content.type === "code" && content.filename) return content.filename;
  const ext = content.type === "code" ? content.language : "txt";
  return `content.${ext}`;
});
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-preview"
    v-on="rootPT.handlers"
  >
    <slot v-if="preview.loading.value" name="loading" v-bind="ctx" />

    <slot v-else-if="!preview.data.value" name="empty" v-bind="ctx" />

    <template v-else>
      <slot name="toolbar" v-bind="ctx">
        <Group
          v-bind="toolbarPT.props"
          class="f-data-preview-toolbar"
          v-on="toolbarPT.handlers"
        >
          <slot name="title" v-bind="ctx">
            <Span
              v-bind="titlePT.props"
              class="f-data-preview-title"
              v-on="titlePT.handlers"
            >
              {{ filename }}
            </Span>
          </slot>

          <slot name="actions" v-bind="ctx">
            <Group class="f-data-preview-actions">
              <Fab
                v-if="content.type === 'code' && content.externalUrl"
                icon="external"
                @click="openExternal"
              />
              <Fab icon="copy" @click="copyAll" />
              <Fab icon="download" @click="download" />
            </Group>
          </slot>
        </Group>
      </slot>

      <Group
        v-bind="bodyPT.props"
        class="f-data-preview-body"
        v-on="bodyPT.handlers"
      >
        <DataPreviewFields
          :preview="preview"
          :pt="pt?.fields"
        >
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </DataPreviewFields>
        <DataPreviewContent
          :preview="preview"
          :pt="pt?.content"
        />
      </Group>
    </template>
  </Group>
</template>
