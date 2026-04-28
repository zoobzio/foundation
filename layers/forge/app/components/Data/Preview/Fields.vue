<script lang="ts">
import type { DataPreviewFieldsProps } from "../../../types/data-preview-fields";
</script>

<script setup lang="ts" generic="T">
const { preview, pt } = defineProps<DataPreviewFieldsProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

const { fields, fieldValue } = preview;

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const scrollerPT = usePassthrough(pt?.scroller, { props: {}, handlers: {} });

const fieldsPT = computed(() =>
  fields.map((field) => ({
    field,
    value: fieldValue(field.key),
    pt: passthrough(pt?.field, { props: {}, handlers: {} }),
    labelPT: passthrough(pt?.label, { props: {}, handlers: {} }),
    valuePT: passthrough(pt?.value, { props: {}, handlers: {} }),
    markdownPT: passthrough(pt?.markdown, {
      props: { content: String(fieldValue(field.key)) },
      handlers: {},
    }),
  })),
);
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-preview-fields"
    v-on="rootPT.handlers"
  >
    <Scroller
      v-bind="scrollerPT.props"
      class="f-data-preview-fields-scroller"
      v-on="scrollerPT.handlers"
    >
      <template #content>
        <Group
          v-for="entry in fieldsPT"
          :key="String(entry.field.key)"
          v-bind="entry.pt.props"
          class="f-data-preview-field"
          v-on="entry.pt.handlers"
        >
          <slot
            :name="`field:${String(entry.field.key)}`"
            v-bind="{ field: entry.field, value: entry.value }"
          >
            <Label
              v-bind="entry.labelPT.props"
              class="f-data-preview-field-label"
              v-on="entry.labelPT.handlers"
            >
              {{ entry.field.label }}
            </Label>
            <Markdown
              v-if="entry.field.type === 'markdown'"
              v-bind="entry.markdownPT.props"
              class="f-data-preview-field-markdown"
              v-on="entry.markdownPT.handlers"
            />
            <Span
              v-else
              v-bind="entry.valuePT.props"
              class="f-data-preview-field-value"
              v-on="entry.valuePT.handlers"
            >
              {{ entry.value }}
            </Span>
          </slot>
        </Group>
      </template>
    </Scroller>
  </Group>
</template>
