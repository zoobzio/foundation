<script setup lang="ts">
export interface HeroProps {
  /** Short punchy headline rendered as AsciiLogo */
  tagline: string;
  /** Supporting description below the tagline */
  description?: string;
  /** CTA button below the description */
  action?: Link;
}

defineProps<HeroProps>();
</script>

<template>
  <div class="f-hero">
    <div class="f-hero-content">
      <AsciiLogo :text="tagline" :link="false" />
      <P v-if="description">{{ description }}</P>
      <Button v-if="action" :label="action.label" :link="action" />
    </div>
    <div v-if="$slots.showcase" class="f-hero-showcase">
      <slot name="showcase" />
    </div>
  </div>
</template>
