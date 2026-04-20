<script lang="ts">
import type { ShareMenuProps } from "../types/share-menu";
</script>

<script setup lang="ts">
const props = defineProps<ShareMenuProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const resolvedUrl = computed(() => props.url ?? (import.meta.client ? window.location.href : ""));
const resolvedTitle = computed(() => props.title ?? "");

const encodedUrl = computed(() => encodeURIComponent(resolvedUrl.value));
const encodedTitle = computed(() => encodeURIComponent(resolvedTitle.value));

const links = computed<{ label: string; icon: IconAlias; href: string }[]>(() => [
  {
    label: "X",
    icon: "x",
    href: `https://x.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
  },
  {
    label: "Bluesky",
    icon: "bluesky",
    href: `https://bsky.app/intent/compose?text=${encodedTitle.value}%20${encodedUrl.value}`,
  },
  {
    label: "Reddit",
    icon: "reddit",
    href: `https://www.reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}`,
  },
  {
    label: "Hacker News",
    icon: "hacker-news",
    href: `https://news.ycombinator.com/submitlink?u=${encodedUrl.value}&t=${encodedTitle.value}`,
  },
]);

const copied = ref(false);
const copyLink = async () => {
  await navigator.clipboard.writeText(resolvedUrl.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const ctx = computed(() => ({ title: props.title, url: resolvedUrl.value, links: links.value, copied: copied.value }));
</script>

<template>
  <Popover ref="el" side="bottom" align="end">
    <slot name="trigger" v-bind="ctx">
      <Button class="f-share-trigger">
        <Icon :alias="copied ? 'link-copied' : 'share'" />
        {{ copied ? "Copied" : "Share" }}
      </Button>
    </slot>
    <template #content>
      <slot v-bind="ctx">
        <Group class="f-share-menu">
          <Anchor
            v-for="link in links"
            :key="link.label"
            :to="link.href"
            :external="true"
            target="_blank"
            class="f-share-menu-item"
          >
            <Icon :alias="link.icon" />
            {{ link.label }}
          </Anchor>
          <Button class="f-share-menu-item" @click="copyLink">
            <Icon :alias="copied ? 'link-copied' : 'link'" />
            {{ copied ? "Copied" : "Copy link" }}
          </Button>
        </Group>
      </slot>
    </template>
  </Popover>
</template>
