<script setup lang="ts">
import type { CollectionConfig } from "@foundation/prose/app/composables/search";

const open = ref(false);
const searchRef = ref<InstanceType<typeof ContentSearch>>();

const appConfig = useAppConfig();

const searchCollections = computed<CollectionConfig[]>(() =>
  appConfig.collections?.map((c: { key: string; title: string; icon?: string }) => ({
    key: c.key,
    basePath: `/${c.key}`,
    title: c.title,
    icon: c.icon,
  })) ?? []
);

const isMac = computed(() => {
  if (typeof navigator !== "undefined") {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));

watch(open, (isOpen) => {
  if (isOpen) {
    searchRef.value?.focus();
  } else {
    searchRef.value?.clear();
  }
});

const onSelect = (path: string) => {
  open.value = false;
  navigateTo(path);
};
</script>

<template>
  <Tooltip>
    <Button shortcut="k" @click="open = true">
      <Icon alias="search" />
    </Button>
    <template #content>
      <span>Search</span>
      <Kbd>
        {{ modKey }}
        <Icon alias="plus" :tokens="{ icon: { 'font-size': 'ref-text-xs' } }" />
        K
      </Kbd>
    </template>
  </Tooltip>

  <Dialog v-model:open="open" title="Search" description="Search documentation">
    <ContentSearch
      ref="searchRef"
      :collections="searchCollections"
      @select="onSelect"
    />
  </Dialog>
</template>
