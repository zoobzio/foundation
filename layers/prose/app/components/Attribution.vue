<script setup lang="ts">
export interface AttributionProps {
  author?: string;
  published?: string;
  tags?: string[];
  tokens?: Tokens<
    | "attribution-root"
    | "attribution-container"
    | "attribution-meta"
    | "attribution-author"
    | "attribution-published"
    | "attribution-tags"
  >;
}

const { author, published, tags, tokens } = defineProps<AttributionProps>();

const styles = useTokenStyle(tokens);

const formattedDate = computed(() => {
  if (!published) return "";
  const date = new Date(published);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<template>
  <div
    v-if="author || published || tags?.length"
    :style="styles['attribution-root']"
    class="f-attribution-root"
  >
    <div
      :style="styles['attribution-container']"
      class="f-attribution-container"
    >
      <div :style="styles['attribution-meta']" class="f-attribution-meta">
        <template v-if="author">
          <Icon alias="user" />
          <span
            :style="styles['attribution-author']"
            class="f-attribution-author"
          >
            {{ author }}
          </span>
        </template>
        <template v-if="published">
          <Icon alias="calendar" />
          <span
            :style="styles['attribution-published']"
            class="f-attribution-published"
          >
            {{ formattedDate }}
          </span>
        </template>
      </div>
      <Group
        v-if="tags?.length"
        :tokens="{
          group: {
            gap: 'ref-spacing-xs',
            'flex-wrap': 'ref-flex-wrap',
            'justify-content': 'ref-align-end',
          },
        }"
      >
        <Chip v-for="tag in tags" :key="tag" :label="tag" />
      </Group>
    </div>
  </div>
</template>
