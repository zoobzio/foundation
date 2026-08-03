import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
