<script setup lang="ts">
export interface AttributionProps {
  author?: string;
  published?: string;
  updated?: string;
  readtime?: string;
  editUrl?: string;
  tokens?: Tokens<
    | "attribution-root"
    | "attribution-author"
    | "attribution-published"
    | "attribution-readtime"
    | "attribution-edit"
  >;
}

const props = defineProps<AttributionProps>();

const styles = useTokenStyle(props.tokens);

const formatDate = (dateStr: string | Date) => {
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
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
    :style="styles['attribution-root']"
    class="f-attribution-root"
  >
    <span
      v-if="props.author"
      :style="styles['attribution-author']"
      class="f-attribution-author"
    >
      <Avatar
        :src="`https://github.com/${props.author}.png`"
        :alt="props.author"
        :tokens="{
          'avatar-root': {
            width: 'ref-spacing-md',
            height: 'ref-spacing-md',
          },
        }"
      >
        <template #fallback>
          <Icon alias="user" />
        </template>
      </Avatar>
      {{ props.author }}
    </span>
    <span
      v-if="props.published || props.updated"
      :style="styles['attribution-published']"
      class="f-attribution-published"
    >
      <Icon alias="calendar" />
      {{ formattedDate }}
    </span>
    <span
      v-if="props.readtime"
      :style="styles['attribution-readtime']"
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
      :style="styles['attribution-edit']"
      class="f-attribution-edit"
    >
      Edit this page
      <Icon alias="external" />
    </a>
  </div>
</template>

<style>
@import '#build/untheme/attribution-root.css';
@import '#build/untheme/attribution-author.css';
@import '#build/untheme/attribution-published.css';
@import '#build/untheme/attribution-readtime.css';
@import '#build/untheme/attribution-edit.css';
</style>
