import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  Ref,
  VNode,
} from "vue";

/**
 * The parts of the file input that accept passthrough. `root` is the
 * wrapping `div`, `input` the native file input; `item` and `itemRemove`
 * are built per picked file.
 */
export type FileInputPassthrough = {
  root: Passthrough<HTMLAttributes>;
  input: Passthrough<InputHTMLAttributes>;
  item: PassthroughIter<File, HTMLAttributes>;
  itemRemove: PassthroughIter<File, ButtonHTMLAttributes>;
};

/**
 * Props of the file input. `modelValue` is the picked files, one at most
 * unless `multiple`. A pick replaces the list, as the native input does;
 * `accept` and `capture` read as the native attributes do.
 */
export type FileInputProps = {
  modelValue?: File[];
  multiple?: boolean;
  accept?: string;
  capture?: "user" | "environment";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  pt?: PT<FileInputPassthrough>;
};

/**
 * Emits of the file input.
 */
export type FileInputEmits = {
  "update:modelValue": [value: File[]];
};

/**
 * The file input view model, served to `defineExpose` and the slots.
 */
export type FileInputContext = {
  multiple: boolean;
  accept?: string;
  capture?: "user" | "environment";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  modelValue: Ref<File[]>;
  el: HTMLDivElement | null;
  settings: FileInputPassthrough;
};

/**
 * Slots of the file input. Each slot receives the context. Item slots
 * also receive the `file`.
 */
export type FileInputSlots = {
  input?: (props: FileInputContext) => VNode[];
  item?: (props: FileInputContext & { file: File }) => VNode[];
  itemName?: (props: FileInputContext & { file: File }) => VNode[];
  itemRemove?: (props: FileInputContext & { file: File }) => VNode[];
  itemRemoveIcon?: (props: FileInputContext & { file: File }) => VNode[];
};

/**
 * A file input instance as data: props plus emit listeners.
 */
export type FileInputDefinition = Definition<FileInputProps, FileInputEmits>;
