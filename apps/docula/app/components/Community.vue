<script lang="ts">
export interface CommunityLink {
  label: string;
  to: string;
  icon: string;
}

export interface CommunityProps {
  links: CommunityLink[];
  title?: string;
  icon?: string;
  tokens?: Tokens<"caption" | "community-root" | "community-content" | "community-item">;
}
</script>

<script setup lang="ts">
const {
  links,
  title = "Community",
  icon = "community",
  tokens,
} = defineProps<CommunityProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <nav :style="styles['community-root']" class="f-community-root">
    <Caption :icon="icon" :tokens="tokens">
      {{ title }}
    </Caption>
    <div :style="styles['community-content']" class="f-community-content">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        target="_blank"
        external
        :style="styles['community-item']"
        class="f-community-item"
      >
        <Icon :alias="link.icon" />
        {{ link.label }}
      </NuxtLink>
    </div>
  </nav>
</template>

<style>
@import '#build/untheme/community-root.css';
@import '#build/untheme/community-content.css';
@import '#build/untheme/community-item.css';
</style>
