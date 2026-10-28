import type { CheckboxRootProps, CheckboxRootEmits } from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, HTMLAttributes, Ref, VNode } from "vue";

/**
 * The parts of the checkbox that accept passthrough. `root` is the
 * rendered button, so it also takes HTML attributes: a form lays its
 * `id` and `aria-describedby` there.
 */
export type CheckboxPassthrough = {
  root: Passthrough<CheckboxRootProps & HTMLAttributes, CheckboxRootEmits>;
};

/**
 * Props of the checkbox. `modelValue` can be `"indeterminate"`.
 */
export type CheckboxProps = {
  modelValue?: boolean | "indeterminate";
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  pt?: PT<CheckboxPassthrough>;
};

/**
 * Emits of the checkbox.
 */
export type CheckboxEmits = {
  "update:modelValue": [value: boolean | "indeterminate"];
};

/**
 * The checkbox view model, served to `defineExpose` and the slots.
 */
export type CheckboxContext = {
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  modelValue: Ref<boolean | "indeterminate" | undefined>;
  el: ComponentPublicInstance | null;
  settings: CheckboxPassthrough;
};

/**
 * Slots of the checkbox. Each slot receives the context.
 */
export type CheckboxSlots = {
  indicator?: (props: CheckboxContext) => VNode[];
  icon?: (props: CheckboxContext) => VNode[];
};

/**
 * A checkbox instance as data: props plus emit listeners.
 */
export type CheckboxDefinition = Definition<CheckboxProps, CheckboxEmits>;
