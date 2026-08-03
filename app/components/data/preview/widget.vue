<script lang="ts">
import type {
  PreviewWidgetContext,
  PreviewWidgetEmits,
  PreviewWidgetPassthrough,
  PreviewWidgetProps,
  PreviewWidgetSlots,
} from "#foundation/types/data/preview/widget";
import type { Events } from "#foundation/types/data/preview";
import type { ComponentPublicInstance } from "vue";

import Fab from "#foundation/components/core/fab.vue";
import Group from "#foundation/components/common/group.vue";
import Span from "#foundation/components/common/span.vue";

import { useTemplateRef } from "#imports";
import { usePreview } from "#foundation/composables/preview";
import { useHooks } from "#foundation/composables/hook";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useLazyRequest } from "#foundation/composables/request";
import {
  PREVIEW_COPY_ICON,
  PREVIEW_DOWNLOAD_ICON,
  PREVIEW_EXTERNAL_ICON,
} from "#foundation/constants/preview";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<PreviewWidgetProps<T>>();

const emit = defineEmits<PreviewWidgetEmits>();

useHooks<Events>(service.id, {
  "preview:loaded": (event) => emit("loaded", event),
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { loading, data, filename, hasExternal, copy, download, openExternal } =
  usePreview(service);

const settings = usePassthrough<PreviewWidgetPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    toolbar: {},
    title: {},
    actions: {},
    body: {},
    external: { icon: PREVIEW_EXTERNAL_ICON, onClick: openExternal },
    copy: { icon: PREVIEW_COPY_ICON, onClick: copy },
    download: { icon: PREVIEW_DOWNLOAD_ICON, onClick: download },
  },
}));

const ctx = useContext<PreviewWidgetContext<T>>("data-preview", () => ({
  preview: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<PreviewWidgetSlots<T>>();

useLazyRequest(`init-preview-${service.id}`, () => service.init());
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-preview">
    <slot v-if="loading" name="loading" v-bind="ctx" />

    <slot v-else-if="!data" name="empty" v-bind="ctx" />

    <template v-else>
      <slot name="toolbar" v-bind="ctx">
        <Group v-bind="settings.toolbar" class="f-data-preview-toolbar">
          <slot name="title" v-bind="ctx">
            <Span v-bind="settings.title" class="f-data-preview-title">
              {{ filename }}
            </Span>
          </slot>
          <slot name="actions" v-bind="ctx">
            <Group v-bind="settings.actions" class="f-data-preview-actions">
              <Fab v-if="hasExternal" v-bind="settings.external" />
              <Fab v-bind="settings.copy" />
              <Fab v-bind="settings.download" />
            </Group>
          </slot>
        </Group>
      </slot>

      <Group v-bind="settings.body" class="f-data-preview-body">
        <slot name="body" v-bind="ctx" />
      </Group>
    </template>
  </Group>
</template>
