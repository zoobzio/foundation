<script lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import type { ContentTableProps } from "../types/content-table";
</script>

<script setup lang="ts">
const { collection, versionPrefix, nodes, headingDepth = 3 } = defineProps<ContentTableProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const appConfig = useAppConfig() as { collection?: { navIcons?: Record<string, IconAlias> } };
const navIcons = computed(() => appConfig.collection?.navIcons ?? {});

const { data: navigation } = collection
  ? await useAsyncData(
      `content-table-nav-${String(collection)}`,
      () => queryCollectionNavigation(collection, ["description"]),
    )
  : { data: ref(null) };

const resolvedNodes = computed(() => {
  if (nodes) return nodes;
  if (!navigation.value) return [];
  if (versionPrefix) {
    const versionNode = navigation.value.find(
      (item: ContentNavigationItem) => item.path === `/${versionPrefix}`,
    );
    return versionNode?.children ?? [];
  }
  if (navigation.value.length === 1 && navigation.value[0]?.children?.length) {
    return navigation.value[0]!.children!
  }
  return navigation.value;
});

const headingComponents = { 3: resolveComponent("H3"), 4: resolveComponent("H4"), 5: resolveComponent("H5"), 6: resolveComponent("H6") } as const;
const heading = computed(() => headingComponents[Math.min(headingDepth, 6) as keyof typeof headingComponents]);

const ctx = computed(() => ({ collection, versionPrefix, nodes, headingDepth, resolvedNodes: resolvedNodes.value }));
</script>

<template>
  <Group ref="el" class="f-content-table">
    <slot v-bind="ctx">
      <template v-for="node in resolvedNodes" :key="node.path">
        <!-- Leaf page -->
        <Group v-if="!node.children?.length" class="f-content-table-section">
          <Group class="f-content-table-grid">
            <Group class="f-content-table-entry">
              <Anchor :to="node.path" class="f-content-table-entry-title">{{ node.title }}</Anchor>
              <Span
                v-if="node.description"
                class="f-content-table-entry-description"
              >
                {{ node.description }}
              </Span>
            </Group>
          </Group>
        </Group>
        <!-- Category with children -->
        <Group v-else class="f-content-table-section">
          <component :is="heading">
            <Icon v-if="node.title && navIcons[node.title]" :alias="navIcons[node.title]!" />
            {{ node.title }}
          </component>
          <Group class="f-content-table-grid">
            <template v-for="child in node.children" :key="child.path">
              <Group v-if="!child.children?.length" class="f-content-table-entry">
                <Anchor :to="child.path" class="f-content-table-entry-title">{{ child.title }}</Anchor>
                <Span
                  v-if="child.description"
                  class="f-content-table-entry-description"
                >
                  {{ child.description }}
                </Span>
              </Group>
            </template>
          </Group>
          <template v-for="child in node.children" :key="`sub-${child.path}`">
            <ContentTable
              v-if="child.children?.length"
              :nodes="[child]"
              :heading-depth="headingDepth + 1"
            />
          </template>
        </Group>
      </template>
    </slot>
  </Group>
</template>
