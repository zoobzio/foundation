<script setup lang="ts">
import type { InputProps } from "../types/input";

const {
  type = "text",
  placeholder,
  disabled,
  required,
  name,
  shortcut,
  tokens,
} = defineProps<InputProps>();

const model = defineModel<string>();

const emit = defineEmits<{
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
}>();

const styles = useTokenStyle(tokens);

const inputRef = useTemplateRef<HTMLInputElement>("input");

if (shortcut) {
  const keys = useMagicKeys();
  const combo = computed(() => keys[shortcut]?.value);

  whenever(combo, () => {
    inputRef.value?.focus();
  });
}

const focus = () => inputRef.value?.focus();
const blur = () => inputRef.value?.blur();

defineExpose({ focus, blur });
</script>

<template>
  <div :style="styles['input-root']" class="f-input-root" @click="focus">
    <span
      v-if="$slots.prepend"
      :style="styles['input-prepend']"
      class="f-input-prepend"
    >
      <slot name="prepend" />
    </span>
    <input
      ref="input"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :name="name"
      :style="styles['input-input']"
      class="f-input-input"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keydown="emit('keydown', $event)"
    />
    <span
      v-if="$slots.append"
      :style="styles['input-append']"
      class="f-input-append"
    >
      <slot name="append" />
    </span>
  </div>
</template>

<style>
@import "#build/untheme/input-root.css";
@import "#build/untheme/input-prepend.css";
@import "#build/untheme/input-input.css";
@import "#build/untheme/input-append.css";

.f-input-root:focus-within,
.f-input-root:focus-within:hover {
  background: var(--sys-surface);
  box-shadow: var(--ref-shadow-focus-inset);
}
.f-input-input::placeholder {
  color: var(--sys-muted);
}
</style>
