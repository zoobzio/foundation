<script lang="ts">
import type { ContentFiltersProps } from "../types/content-filters";
</script>

<script setup lang="ts">
const { collection: _collection } = defineProps<ContentFiltersProps>();

const el = useTemplateRef("el");
defineExpose({ el });

// Placeholder data - will be dynamic later
const searchQuery = ref("");
const tags = ref<string[]>([]);
const sortBy = ref("published-desc");

const sortOptions = [
  { value: "published-desc", label: "Newest First" },
  { value: "published-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
];

const ctx = computed(() => ({ searchQuery: searchQuery.value, tags: tags.value, sortBy: sortBy.value, sortOptions }));
</script>

<template>
  <Group ref="el" class="f-content-filters">
    <slot v-bind="ctx">
      <!-- Query Header -->
      <Caption>
        <Icon alias="filter" />
        Query Content
      </Caption>

      <!-- Query Section -->
      <Group class="f-content-filters-section">
        <Label for="search">Search</Label>
        <Input
          id="search"
          v-model="searchQuery"
          type="search"
          placeholder="Search content..."
        />
        <Label for="tags">Tags</Label>
        <TagsInput
          id="tags"
          v-model="tags"
          placeholder="Add tags..."
        />
      </Group>

      <!-- Sort Header -->
      <Caption>
        <Icon alias="sort" />
        Sort Content
      </Caption>

      <!-- Sort Section -->
      <Group class="f-content-filters-section">
        <Label for="sort">Sort By</Label>
        <Select
          id="sort"
          v-model="sortBy"
          :options="sortOptions"
        />
      </Group>
    </slot>
  </Group>
</template>
