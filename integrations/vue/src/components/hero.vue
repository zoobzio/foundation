<script lang="ts">
import type {
  HeroPassthrough,
  HeroProps,
  HeroContext,
  HeroSlots,
} from "../types/components/hero";

import { Primitive } from "reka-ui";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { anchor } from "../utils/link";
</script>

<script setup lang="ts">
const { tagline, taglineHighlight, description, action, pt } =
  defineProps<HeroProps>();

const el = useTemplateRef<HTMLElement>("el");

const settings = usePassthrough<HeroPassthrough>(() => ({
  pt,
  recipes: {
    link: anchor(action, action?.disabled),
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
  <section ref="el" class="f-section">
    <slot name="content" v-bind="ctx">
      <div class="f-group">
        <slot name="tagline" v-bind="ctx">
          <h1 class="f-h1">
            {{ tagline }}
            <slot name="taglineHighlight" v-bind="ctx">
              <em v-if="taglineHighlight" class="f-em">
                {{ taglineHighlight }}
              </em>
            </slot>
          </h1>
        </slot>
        <slot name="description" v-bind="ctx">
          <p v-if="description" class="f-p">
            {{ description }}
          </p>
        </slot>
        <slot name="action" v-bind="ctx">
          <Primitive v-if="action" class="f-anchor" v-bind="settings.link">
            {{ action.label }}
          </Primitive>
        </slot>
      </div>
    </slot>
    <div v-if="$slots.showcase" class="f-group">
      <slot name="showcase" v-bind="ctx" />
    </div>
  </section>
</template>
