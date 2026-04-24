<script lang="ts">
import type { HeroProps } from "../types/hero";
</script>

<script setup lang="ts">
const { tagline, taglineHighlight, description, action, pt } = defineProps<HeroProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {});
const contentPT = usePassthrough(pt?.content, {});
const taglinePT = usePassthrough(pt?.tagline, {});
const descriptionPT = usePassthrough(pt?.description, {});
const buttonPT = usePassthrough(pt?.button, {});
const showcasePT = usePassthrough(pt?.showcase, {});

const ctx = computed(() => ({ tagline, taglineHighlight, description, action }));
</script>

<template>
  <Section ref="el" v-bind="rootPT.props" v-on="rootPT.handlers" class="f-hero">
    <slot name="content" v-bind="ctx">
      <Group v-bind="contentPT.props" v-on="contentPT.handlers" class="f-hero-content">
        <slot name="tagline" v-bind="ctx">
          <H1 v-bind="taglinePT.props" v-on="taglinePT.handlers" class="f-hero-tagline">
            {{ tagline }}
            <Em v-if="taglineHighlight" class="f-hero-tagline-highlight">
              {{ taglineHighlight }}
            </Em>
          </H1>
        </slot>
        <slot name="description" v-bind="ctx">
          <P v-if="description" v-bind="descriptionPT.props" v-on="descriptionPT.handlers">{{ description }}</P>
        </slot>
        <slot name="button" v-bind="ctx">
          <Button v-if="action" v-bind="buttonPT.props" v-on="buttonPT.handlers" :label="action.label" />
        </slot>
      </Group>
    </slot>
    <Group v-if="$slots.showcase" v-bind="showcasePT.props" v-on="showcasePT.handlers" class="f-hero-showcase">
      <slot name="showcase" v-bind="ctx" />
    </Group>
  </Section>
</template>
