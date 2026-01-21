<script lang="ts">
import type { caption } from "@foundation/blocks/elements";
import type { toc } from "../../elements.config";
</script>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
export interface TocProps {
  links: TocLink[];
  title?: string;
  tokens?: Tokens<typeof caption.key | typeof toc.root | typeof toc.content | typeof toc.item>;
}

interface FlatTocLink {
  id: string;
  text: string;
  depth: number;
}

const { links, title = "On this page", tokens } = defineProps<TocProps>();

const styles = useTokenStyle(tokens);

// Flatten nested links into a single array with depth preserved
const flatLinks = computed<FlatTocLink[]>(() => {
  const flatten = (items: TocLink[]): FlatTocLink[] => {
    return items.flatMap((item) => [
      { id: item.id, text: item.text, depth: item.depth },
      ...(item.children ? flatten(item.children) : []),
    ]);
  };
  return flatten(links);
});

// Track which heading is currently active based on scroll position
const activeId = ref<string>("");
const visibleHeadings = ref<Set<string>>(new Set());

// Setup intersection observers for all headings
onMounted(() => {
  const observerOptions = {
    rootMargin: "0px 0px 0px",
    threshold: 0,
  };

  flatLinks.value.forEach((link) => {
    const element = document.getElementById(link.id);
    if (element) {
      useIntersectionObserver(
        element,
        (entries) => {
          const isIntersecting = entries[0]?.isIntersecting;
          if (isIntersecting) {
            visibleHeadings.value.add(link.id);
          } else {
            visibleHeadings.value.delete(link.id);
          }

          // Set active to the first visible heading
          if (visibleHeadings.value.size > 0) {
            const firstVisible = flatLinks.value.find((l) =>
              visibleHeadings.value.has(l.id),
            );
            if (firstVisible) {
              activeId.value = firstVisible.id;
            }
          }
        },
        observerOptions,
      );
    }
  });
});

// Calculate padding based on depth (TOC starts at h2, so depth 2 = 0 extra padding)
const getItemStyle = (depth: number) => {
  const baseStyle = styles.value["toc-item"] || {};
  const depthPadding = `calc(1rem * ${depth - 2})`;
  return {
    ...baseStyle,
    paddingLeft: `calc(${baseStyle.paddingLeft || "1rem"} + ${depthPadding})`,
  };
};
</script>

<template>
  <nav :style="styles['toc-root']" class="f-toc-root">
    <Caption icon="toc" :tokens="tokens">
      {{ title }}
    </Caption>
    <div :style="styles['toc-content']" class="f-toc-content">
      <NuxtLink
        v-for="link in flatLinks"
        :key="link.id"
        :to="`#${link.id}`"
        :aria-selected="visibleHeadings.has(link.id) ? 'true' : undefined"
        :style="getItemStyle(link.depth)"
        class="f-toc-item"
      >
        <slot name="item" :link="link">
          {{ link.text }}
        </slot>
      </NuxtLink>
    </div>
  </nav>
</template>

<style>
@import '#build/untheme/toc-root.css';
@import '#build/untheme/toc-content.css';
@import '#build/untheme/toc-item.css';
</style>
