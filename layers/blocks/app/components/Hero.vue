<script setup lang="ts">
export interface HeroProps {
  /** Short punchy headline */
  tagline: string;
  /** Highlighted portion of the tagline */
  taglineHighlight?: string;
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
      <H1 class="f-hero-tagline">
        {{ tagline }}
        <span v-if="taglineHighlight" class="f-hero-tagline-highlight">
          {{ taglineHighlight }}
        </span>
      </H1>
      <P v-if="description">{{ description }}</P>
      <Button v-if="action" :label="action.label" :link="action" />
    </div>
    <div v-if="$slots.showcase" class="f-hero-showcase">
      <slot name="showcase" />
    </div>
  </div>
</template>
