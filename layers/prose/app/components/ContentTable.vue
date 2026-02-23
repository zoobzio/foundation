<script lang="ts">
import type { PageCollections, ContentNavigationItem } from "@nuxt/content";

export interface ContentTableProps {
  collection: keyof PageCollections;
  /** Optional version prefix to filter content (e.g., "v1.0.0") */
  versionPrefix?: string;
}
</script>

<script setup lang="ts">
const { collection, versionPrefix } = defineProps<ContentTableProps>();

const { data: items } = await useAsyncData(
  `content-table-items-${String(collection)}`,
  () => queryCollection(collection).all(),
);

const { data: navigation } = await useAsyncData(
  `content-table-nav-${String(collection)}`,
  () => queryCollectionNavigation(collection),
);

// Extract filter options from data
const categories = computed(() => {
  if (!navigation.value) return [];
  return navigation.value
    .filter((item: ContentNavigationItem) => item.title && item.path)
    .map((item: ContentNavigationItem) => ({
      value: item.path!,
      label: item.title!,
    }));
});

const allTags = computed(() => {
  if (!items.value) return [];
  const tagSet = new Set<string>();
  for (const item of items.value as PageContent[]) {
    if (item.tags) {
      for (const tag of item.tags) {
        tagSet.add(tag);
      }
    }
  }
  return Array.from(tagSet)
    .sort()
    .map((tag) => ({ value: tag, label: tag }));
});

const allAuthors = computed(() => {
  if (!items.value) return [];
  const authorSet = new Set<string>();
  for (const item of items.value as PageContent[]) {
    if (item.author) {
      authorSet.add(item.author);
    }
  }
  return Array.from(authorSet)
    .sort()
    .map((author) => ({ value: author, label: author }));
});

// Filter state
const selectedCategories = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const selectedAuthors = ref<string[]>([]);
const dateRange = ref<DateRange | undefined>();
const sortField = ref<string>("published");
const sortDirection = ref<"asc" | "desc">("desc");

const sortOptions = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "published-desc", label: "Newest first" },
  { value: "published-asc", label: "Oldest first" },
  { value: "author-asc", label: "Author A-Z" },
  { value: "author-desc", label: "Author Z-A" },
];

const sortValue = computed({
  get: () => `${sortField.value}-${sortDirection.value}`,
  set: (val: string) => {
    const [field, dir] = val.split("-");
    sortField.value = field;
    sortDirection.value = dir as "asc" | "desc";
  },
});

// Filtered and sorted items
const filteredItems = computed(() => {
  if (!items.value) return [];
  let result = items.value as PageContent[];

  // Filter by version prefix
  if (versionPrefix) {
    result = result.filter((item) => {
      if (!item.path) return false;
      return item.path.startsWith(`/${versionPrefix}/`);
    });
  }

  // Filter by categories (path prefix match)
  if (selectedCategories.value.length > 0) {
    result = result.filter((item) => {
      if (!item.path) return false;
      return selectedCategories.value.some((cat) => item.path.startsWith(cat));
    });
  }

  // Filter by tags
  if (selectedTags.value.length > 0) {
    result = result.filter((item) => {
      if (!item.tags) return false;
      return selectedTags.value.some((tag) => item.tags!.includes(tag));
    });
  }

  // Filter by authors
  if (selectedAuthors.value.length > 0) {
    result = result.filter((item) => {
      if (!item.author) return false;
      return selectedAuthors.value.includes(item.author);
    });
  }

  // Filter by date range
  if (dateRange.value?.start && dateRange.value?.end) {
    const startDate = new Date(
      dateRange.value.start.year,
      dateRange.value.start.month - 1,
      dateRange.value.start.day,
    );
    const endDate = new Date(
      dateRange.value.end.year,
      dateRange.value.end.month - 1,
      dateRange.value.end.day,
    );
    result = result.filter((item) => {
      if (!item.published) return false;
      const itemDate = new Date(item.published);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  // Sort
  result = [...result].sort((a, b) => {
    let comparison = 0;
    if (sortField.value === "title") {
      comparison = (a.title ?? "").localeCompare(b.title ?? "");
    } else if (sortField.value === "published") {
      const dateA = a.published ? new Date(a.published).getTime() : 0;
      const dateB = b.published ? new Date(b.published).getTime() : 0;
      comparison = dateA - dateB;
    } else if (sortField.value === "author") {
      comparison = (a.author ?? "").localeCompare(b.author ?? "");
    }
    return sortDirection.value === "desc" ? -comparison : comparison;
  });

  return result;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get category label from path
const getCategoryLabel = (path: string) => {
  for (const cat of categories.value) {
    if (path.startsWith(cat.value)) {
      return cat.label;
    }
  }
  return "";
};

const clearFilters = () => {
  selectedCategories.value = [];
  selectedTags.value = [];
  selectedAuthors.value = [];
  dateRange.value = undefined;
};

const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    selectedTags.value.length > 0 ||
    selectedAuthors.value.length > 0 ||
    dateRange.value !== undefined
  );
});
</script>

<template>
  <div class="f-content-table-layout">
    <aside class="f-content-table-filters">
      <div v-if="categories.length" class="f-content-table-filter">
        <Caption>Categories</Caption>
        <MultiSelect
          v-model="selectedCategories"
          :items="categories"
          placeholder="All categories"
        />
      </div>

      <div v-if="allTags.length" class="f-content-table-filter">
        <Caption>Tags</Caption>
        <MultiSelect
          v-model="selectedTags"
          :items="allTags"
          placeholder="All tags"
        />
      </div>

      <div v-if="allAuthors.length" class="f-content-table-filter">
        <Caption>Authors</Caption>
        <MultiSelect
          v-model="selectedAuthors"
          :items="allAuthors"
          placeholder="All authors"
        />
      </div>

      <div class="f-content-table-filter">
        <Caption>Date Range</Caption>
        <DateRangePicker v-model="dateRange" :number-of-months="1" />
      </div>

      <div class="f-content-table-filter">
        <Caption>Sort</Caption>
        <Select v-model="sortValue" :options="sortOptions" />
      </div>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="f-content-table-clear"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </aside>

    <div class="f-content-table-main">
      <div v-if="!filteredItems.length" class="f-content-table-empty">
        No items found
      </div>
      <div v-else class="f-content-table-grid">
        <NuxtLink
          v-for="item in filteredItems"
          :key="item.id"
          :to="item.path"
          class="f-content-table-card-link"
        >
          <Card class="f-content-table-card">
            <div class="f-content-table-card-meta">
              <span v-if="item.author">{{ item.author }}</span>
              <span v-if="item.published">{{ formatDate(item.published) }}</span>
            </div>
            <div class="f-content-table-card-content">
              <Strong>{{ item.title }}</Strong>
              <p v-if="item.description" class="f-content-table-card-description">
                {{ item.description }}
              </p>
            </div>
            <div v-if="item.tags?.length" class="f-content-table-tags">
              <Chip v-for="tag in item.tags" :key="tag">{{ tag }}</Chip>
            </div>
          </Card>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
