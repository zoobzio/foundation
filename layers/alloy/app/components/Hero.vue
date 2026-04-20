<script lang="ts">
import type { HeroProps } from "../types/hero";
</script>

<script setup lang="ts">
const { tagline, taglineHighlight, description, action, pt } = defineProps<HeroProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ tagline, taglineHighlight, description, action }));
</script>

<template>
  <Section ref="el" v-bind="pt?.root" class="f-hero">
    <slot name="content" v-bind="ctx">
      <Group v-bind="pt?.content" class="f-hero-content">
        <slot name="tagline" v-bind="ctx">
          <H1 v-bind="pt?.tagline" class="f-hero-tagline">
            {{ tagline }}
            <Em v-if="taglineHighlight" class="f-hero-tagline-highlight">
              {{ taglineHighlight }}
            </Em>
          </H1>
        </slot>
        <slot name="description" v-bind="ctx">
          <P v-if="description" v-bind="pt?.description">{{ description }}</P>
        </slot>
        <slot name="button" v-bind="ctx">
          <Button v-if="action" v-bind="pt?.button" :label="action.label" />
        </slot>
      </Group>
    </slot>
    <Group v-if="$slots.showcase" v-bind="pt?.showcase" class="f-hero-showcase">
      <slot name="showcase" v-bind="ctx" />
    </Group>
  </Section>
</template>
