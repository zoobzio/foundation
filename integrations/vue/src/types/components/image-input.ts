import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  Ref,
  VNode,
} from "vue";

/**
 * The image an image input holds: the URL of a stored image, a newly
 * picked `File`, or undefined for none.
 */
export type ImageInputValue = File | string | undefined;

/**
 * The parts of the image input that accept passthrough. `root` is the
 * wrapping `div`. `preview` is the `img` shown while there is an image and
 * `placeholder` the `div` shown while there is none. `input` is the native
 * file input, `pick` the `label` that opens it, and `remove` the button
 * that drops the image.
 */
export type ImageInputPassthrough = {
  root: Passthrough<HTMLAttributes>;
  preview: Passthrough<ImgHTMLAttributes>;
  placeholder: Passthrough<HTMLAttributes>;
  input: Passthrough<InputHTMLAttributes>;
  pick: Passthrough<LabelHTMLAttributes>;
  remove: Passthrough<ButtonHTMLAttributes>;
};

/**
 * Props of the image input. `modelValue` is the stored image's URL or the
 * picked `File`; passing it, even as undefined, makes the model
 * controlled. `accept` defaults to `image/*`; it and `capture` read as the
 * native attributes do. `alt` is the preview's text alternative. A
 * `required` input marks the native input required only while it holds no
 * image, as a stored image leaves the native input empty.
 */
export type ImageInputProps = {
  modelValue?: ImageInputValue;
  accept?: string;
  capture?: "user" | "environment";
  alt?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  pt?: PT<ImageInputPassthrough>;
};

/**
 * Emits of the image input. A pick emits the `File`, a removal undefined.
 */
export type ImageInputEmits = {
  "update:modelValue": [value: ImageInputValue];
};

/**
 * The image input view model, served to `defineExpose` and the slots.
 * `src` is what the preview shows: the stored URL, or an object URL the
 * component holds for a picked `File`; undefined while there is no image.
 */
export type ImageInputContext = {
  accept: string;
  capture?: "user" | "environment";
  alt?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  modelValue: Ref<ImageInputValue>;
  src: string | undefined;
  el: HTMLDivElement | null;
  settings: ImageInputPassthrough;
};

/**
 * Slots of the image input. Each slot receives the context. `preview`
 * renders while there is an image and `placeholder` while there is none,
 * with `placeholderContent` inside it, empty by default;
 * `remove` and its inner slots render only while there is an image.
 */
export type ImageInputSlots = {
  preview?: (props: ImageInputContext) => VNode[];
  placeholder?: (props: ImageInputContext) => VNode[];
  placeholderContent?: (props: ImageInputContext) => VNode[];
  input?: (props: ImageInputContext) => VNode[];
  pick?: (props: ImageInputContext) => VNode[];
  pickPrepend?: (props: ImageInputContext) => VNode[];
  pickText?: (props: ImageInputContext) => VNode[];
  pickAppend?: (props: ImageInputContext) => VNode[];
  remove?: (props: ImageInputContext) => VNode[];
  removePrepend?: (props: ImageInputContext) => VNode[];
  removeText?: (props: ImageInputContext) => VNode[];
  removeAppend?: (props: ImageInputContext) => VNode[];
};

/**
 * An image input instance as data: props plus emit listeners.
 */
export type ImageInputDefinition = Definition<ImageInputProps, ImageInputEmits>;
