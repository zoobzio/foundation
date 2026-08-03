import type {
  CheckboxRootProps,
  CheckboxRootEmits,
} from "#foundation/types/common/checkbox/root";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type CheckboxPassthrough = {
  root: Passthrough<CheckboxRootProps, CheckboxRootEmits>;
  indicator: Passthrough<GroupProps>;
  icon: Passthrough<IconProps>;
};

export type CheckboxProps = {
  modelValue?: boolean | "indeterminate";
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  pt?: PT<CheckboxPassthrough>;
};

export type CheckboxEmits = ComponentEvents["checkbox"] & {
  "update:modelValue": [value: boolean | "indeterminate"];
};

export type CheckboxContext = {
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  modelValue: Ref<boolean | "indeterminate" | undefined>;
  el: ComponentPublicInstance | null;
  settings: CheckboxPassthrough;
};

export type CheckboxSlots = {
  indicator?: (props: CheckboxContext) => VNode[];
  icon?: (props: CheckboxContext) => VNode[];
};
