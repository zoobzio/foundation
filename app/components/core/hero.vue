<script lang="ts">
import type {
  HeroProps,
  HeroContext,
  HeroSlots,
} from "../../types/core/hero";

import { useTemplateRef } from "#imports";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const {
  tagline,
  taglineHighlight,
  description,
  action,
} = defineProps<HeroProps>();

const el = useTemplateRef<HTMLElement>("el");

const ctx = useContext<HeroContext>("hero", () => ({
  tagline,
  taglineHighlight,
  description,
  action,
  el: el.value,
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
        <slot name="button" v-bind="ctx">
          <button v-if="action" type="button" class="f-button">{{ action.label }}</button>
        </slot>
      </div>
    </slot>
    <div v-if="$slots.showcase" class="f-group">
      <slot name="showcase" v-bind="ctx" />
    </div>
  </section>
</template>
