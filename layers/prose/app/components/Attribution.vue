<script lang="ts">
import type { AttributionProps } from "../types/attribution";
</script>

<script setup lang="ts">
const props = defineProps<AttributionProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const formatDate = (dateStr: string | Date) => {
  let date: Date;
  if (dateStr instanceof Date) {
    date = dateStr;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    date = new Date(dateStr + "T00:00:00");
  } else {
    date = new Date(dateStr);
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formattedDate = computed(() => {
  const dateValue = props.updated || props.published;
  if (!dateValue) return "";
  return formatDate(dateValue);
});

const ctx = computed(() => ({ author: props.author, published: props.published, updated: props.updated, readtime: props.readtime, editUrl: props.editUrl, share: props.share, shareTitle: props.shareTitle, formattedDate: formattedDate.value }));
</script>

<template>
  <Group
    v-if="props.author || props.published || props.updated || props.readtime"
    ref="el"
    class="f-attribution-root"
  >
    <slot v-bind="ctx">
      <Anchor
        v-if="props.author"
        :to="`https://github.com/${props.author}`"
        :external="true"
        target="_blank"
        class="f-attribution-author"
      >
        <Avatar
          :src="`/avatars/${props.author}.png`"
          :alt="props.author"
        >
          <template #fallback>
            <Icon alias="user" />
          </template>
        </Avatar>
        {{ props.author }}
      </Anchor>
      <Span
        v-if="props.published || props.updated"
        class="f-attribution-published"
      >
        <Icon alias="calendar" />
        {{ formattedDate }}
      </Span>
      <Span
        v-if="props.readtime"
        class="f-attribution-readtime"
      >
        <Icon alias="book-open" />
        {{ props.readtime }}
      </Span>
      <Anchor
        v-if="props.editUrl"
        :to="props.editUrl"
        :external="true"
        target="_blank"
        class="f-attribution-edit"
      >
        Edit this page
        <Icon alias="external" />
      </Anchor>
      <ShareMenu
        v-if="props.share"
        :title="props.shareTitle"
      />
    </slot>
  </Group>
</template>
