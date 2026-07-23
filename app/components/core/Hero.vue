<script lang="ts">
import type { HeroProps } from "#foundation/types/core/hero";
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import Button from "#foundation/components/common/button.vue";
import Em from "#foundation/components/common/em.vue";
import Group from "#foundation/components/common/group.vue";
import H1 from "#foundation/components/common/h1.vue";
import P from "#foundation/components/common/p.vue";
import Section from "#foundation/components/common/section.vue";
</script>

<script setup lang="ts">
const { tagline, taglineHighlight, description, action, pt } = defineProps<HeroProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const contentPT = usePassthrough(pt?.content, { props: {}, handlers: {} });
const taglinePT = usePassthrough(pt?.tagline, { props: {}, handlers: {} });
const taglineHighlightPT = usePassthrough(pt?.taglineHighlight, { props: {}, handlers: {} });
const descriptionPT = usePassthrough(pt?.description, { props: {}, handlers: {} });
const buttonPT = usePassthrough(pt?.button, {
  props: { ...(action ? { label: action.label } : {}) },
  handlers: {},
});
const showcasePT = usePassthrough(pt?.showcase, { props: {}, handlers: {} });

const ctx = computed(() => ({ tagline, taglineHighlight, description, action }));
</script>

<template>
  <Section ref="el" v-bind="rootPT.props" class="f-hero" v-on="rootPT.handlers">
    <slot name="content" v-bind="ctx">
      <Group v-bind="contentPT.props" class="f-hero-content" v-on="contentPT.handlers">
        <slot name="tagline" v-bind="ctx">
          <H1 v-bind="taglinePT.props" class="f-hero-tagline" v-on="taglinePT.handlers">
            {{ tagline }}
            <slot name="taglineHighlight" v-bind="ctx">
              <Em v-if="taglineHighlight" v-bind="taglineHighlightPT.props" class="f-hero-tagline-highlight" v-on="taglineHighlightPT.handlers">
                {{ taglineHighlight }}
              </Em>
            </slot>
          </H1>
        </slot>
        <slot name="description" v-bind="ctx">
          <P v-if="description" v-bind="descriptionPT.props" v-on="descriptionPT.handlers">{{ description }}</P>
        </slot>
        <slot name="button" v-bind="ctx">
          <Button v-if="action" v-bind="buttonPT.props" v-on="buttonPT.handlers" />
        </slot>
      </Group>
    </slot>
    <Group v-if="$slots.showcase" v-bind="showcasePT.props" class="f-hero-showcase" v-on="showcasePT.handlers">
      <slot name="showcase" v-bind="ctx" />
    </Group>
  </Section>
</template>
