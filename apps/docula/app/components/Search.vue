<script lang="ts">
export interface SearchProps {
  placeholder?: string;
}
</script>

<script setup lang="ts">
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxPortal,
  ComboboxContent,
  ComboboxViewport,
  ComboboxItem,
  ComboboxEmpty,
} from "reka-ui";

withDefaults(defineProps<SearchProps>(), {
  placeholder: "Search...",
});

const router = useRouter();
const { results, search } = useSearch();
const { collection: collectionConfig } = useAppConfig();

const collection = collectionConfig?.key ?? "content";
const { data: navigation } = await useAsyncData(
  `nav-${collection}`,
  () => queryCollectionNavigation(collection),
);

const pathToIcon = computed(() => {
  const map = new Map<string, IconAlias>();
  if (!collectionConfig?.navIcons || !navigation.value) return map;

  for (const folder of navigation.value) {
    if (folder.path && folder.title) {
      const icon = collectionConfig.navIcons[folder.title];
      if (icon) {
        map.set(folder.path, icon);
      }
    }
  }
  return map;
});

const getIcon = (path: string) => {
  for (const [folderPath, icon] of pathToIcon.value) {
    if (path.startsWith(folderPath)) {
      return icon;
    }
  }
  return undefined;
};

const open = ref(false);
const searchTerm = ref("");
const closingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const isMac = computed(() => {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));

watch(open, (isOpen) => {
  if (!isOpen) {
    closingTimeout.value = setTimeout(() => {
      closingTimeout.value = null;
    }, 100);
  }
});

const handleFocus = () => {
  if (!closingTimeout.value) {
    open.value = true;
  }
};

const handleInput = (value: string) => {
  searchTerm.value = value;
  search(value);
};

const handleSelect = (path: string) => {
  open.value = false;
  searchTerm.value = "";
  router.push(path);
};
</script>

<template>
  <ComboboxRoot
    v-model:open="open"
    :ignore-filter="true"
    class="f-search-root"
  >
    <ComboboxAnchor as-child>
      <Input
        :model-value="searchTerm"
        :placeholder="placeholder"
        shortcut="meta+k"
        @focus="handleFocus"
        @update:model-value="handleInput"
      >
        <template #prepend>
          <Icon alias="search" />
        </template>
        <template #append>
          <Kbd>{{ modKey }} + K</Kbd>
        </template>
      </Input>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent class="f-search-results" position="popper">
        <ComboboxViewport>
          <ComboboxEmpty class="f-search-empty">
            {{ searchTerm ? "No results found" : "Start typing to search..." }}
          </ComboboxEmpty>

          <ComboboxItem
            v-for="result in results"
            :key="result.id"
            :value="result.path"
            class="f-search-item"
            as-child
          >
            <NuxtLink :to="result.path" @click="handleSelect(result.path)">
              <Icon v-if="getIcon(result.path)" :alias="getIcon(result.path)" class="f-search-icon" />
              <span>{{ result.title }}</span>
              <template v-if="result.titles.length > 0">
                <Icon alias="chevron-right" class="f-search-separator" />
                <span>{{ result.titles[result.titles.length - 1] }}</span>
              </template>
            </NuxtLink>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
