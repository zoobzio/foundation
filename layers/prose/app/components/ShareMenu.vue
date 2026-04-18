<script setup lang="ts">
const props = defineProps<{
  title?: string;
  url?: string;
}>();

const resolvedUrl = computed(() => props.url ?? (import.meta.client ? window.location.href : ""));
const resolvedTitle = computed(() => props.title ?? "");

const encodedUrl = computed(() => encodeURIComponent(resolvedUrl.value));
const encodedTitle = computed(() => encodeURIComponent(resolvedTitle.value));

const links = computed(() => [
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
</script>

<template>
  <Popover side="bottom" align="end">
    <button class="f-share-trigger">
      <Icon :alias="copied ? 'link-copied' : 'share'" />
      {{ copied ? "Copied" : "Share" }}
    </button>
    <template #content>
      <div class="f-share-menu">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="f-share-menu-item"
        >
          <Icon :alias="link.icon" />
          {{ link.label }}
        </a>
        <button class="f-share-menu-item" @click="copyLink">
          <Icon :alias="copied ? 'link-copied' : 'link'" />
          {{ copied ? "Copied" : "Copy link" }}
        </button>
      </div>
    </template>
  </Popover>
</template>
