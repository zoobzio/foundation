<script lang="ts">
import type {
  HeroProps,
  HeroPassthrough,
  HeroContext,
  HeroSlots,
} from "#foundation/types/core/hero";
import type { ComponentPublicInstance } from "vue";

import Section from "#foundation/components/common/section.vue";
import Group from "#foundation/components/common/group.vue";
import H1 from "#foundation/components/common/h1.vue";
import Em from "#foundation/components/common/em.vue";
import P from "#foundation/components/common/p.vue";
import Button from "#foundation/components/common/button.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  tagline,
  taglineHighlight,
  description,
  action,
  pt,
} = defineProps<HeroProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<HeroPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    content: {},
    tagline: {},
    taglineHighlight: {},
    description: {},
    button: action ? { label: action.label } : {},
    showcase: {},
  },
}));

const ctx = useContext<HeroContext>("hero", () => ({
  tagline,
  taglineHighlight,
  description,
  action,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<HeroSlots>();
</script>

<template>
  <Section ref="el" v-bind="settings.root">
    <slot name="content" v-bind="ctx">
      <Group v-bind="settings.content">
        <slot name="tagline" v-bind="ctx">
          <H1 v-bind="settings.tagline">
            {{ tagline }}
            <slot name="taglineHighlight" v-bind="ctx">
              <Em v-if="taglineHighlight" v-bind="settings.taglineHighlight">
                {{ taglineHighlight }}
              </Em>
            </slot>
          </H1>
        </slot>
        <slot name="description" v-bind="ctx">
          <P v-if="description" v-bind="settings.description">
            {{ description }}
          </P>
        </slot>
        <slot name="button" v-bind="ctx">
          <Button v-if="action" v-bind="settings.button" />
        </slot>
      </Group>
    </slot>
    <Group v-if="$slots.showcase" v-bind="settings.showcase">
      <slot name="showcase" v-bind="ctx" />
    </Group>
  </Section>
</template>
