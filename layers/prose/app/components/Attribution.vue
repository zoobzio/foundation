<script setup lang="ts">
export interface AttributionProps {
  author?: string;
  published?: string;
  updated?: string;
  readtime?: string;
  editUrl?: string;
  share?: boolean;
  shareTitle?: string;
}

const props = defineProps<AttributionProps>();

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
</script>

<template>
  <div
    v-if="props.author || props.published || props.updated || props.readtime"
    class="f-attribution-root"
  >
    <a
      v-if="props.author"
      :href="`https://github.com/${props.author}`"
      target="_blank"
      rel="noopener noreferrer"
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
    </a>
    <span
      v-if="props.published || props.updated"
      class="f-attribution-published"
    >
      <Icon alias="calendar" />
      {{ formattedDate }}
    </span>
    <span
      v-if="props.readtime"
      class="f-attribution-readtime"
    >
      <Icon alias="book-open" />
      {{ props.readtime }}
    </span>
    <a
      v-if="props.editUrl"
      :href="props.editUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="f-attribution-edit"
    >
      Edit this page
      <Icon alias="external" />
    </a>
    <ShareMenu
      v-if="props.share"
      :title="props.shareTitle"
    />
  </div>
</template>

