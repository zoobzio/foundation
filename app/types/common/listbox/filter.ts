import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref } from "vue";
import type {
  ListboxFilterEmits as RekaListboxFilterEmits,
  ListboxFilterProps as RekaListboxFilterProps,
} from "reka-ui";

// ListboxFilter renders a native <input>; `placeholder` is a legitimate native
// attr on that element but absent from reka's prop type, so it is surfaced here.
type FilterNative = { placeholder?: string };

export type ListboxFilterForward = Reshape<RekaListboxFilterProps, "modelValue"> &
  FilterNative;

export type ListboxFilterProps = RekaListboxFilterProps &
  FilterNative & {
    modifiers?: ModifierProps<"listbox-filter">;
    tokens?: TokenProps<"listbox-filter">;
    aria?: AriaProps<"listbox-filter">;
  };

export type ListboxFilterEmits = RekaListboxFilterEmits & ComponentEvents["listbox-filter"];

export type ListboxFilterBindings = Bindings<"listbox-filter", ListboxFilterForward>;

export type ListboxFilterContext = Reshape<ListboxFilterProps, "modelValue"> & {
  modelValue: Ref<string | undefined>;
  bindings: ListboxFilterBindings;
  el: ComponentPublicInstance | null;
};
