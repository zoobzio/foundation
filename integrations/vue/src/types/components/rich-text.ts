import type { EditorContext, EditorPassthrough, EditorSlots } from "./editor";
import type { PT } from "../passthrough";
import type { Definition } from "../definition";
import type { Config } from "@zoobzio/editor";

/**
 * The parts of the rich text that accept passthrough: the editor's own
 * manifest. The rich text lays its layer under the consumer's and hands
 * the result to the editor it renders.
 */
export type RichTextPassthrough = EditorPassthrough;

/**
 * Props of the rich text: a v-model over the document as an HTML string,
 * with the editor behind it owned by the component. `features` is the
 * editor's feature set, read once when the editor is built; `id` names the
 * editor service and defaults to a generated id. An empty document models
 * as `""`.
 */
export type RichTextProps = {
  modelValue?: string;
  id?: string;
  features?: Config;
  disabled?: boolean;
  required?: boolean;
  pt?: PT<RichTextPassthrough>;
};

/**
 * Emits of the rich text. `blur` relays the content host's blur, so a form
 * validates the field when the user leaves it.
 */
export type RichTextEmits = {
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
};

/**
 * The rich text view model: the wrapped editor's context, forwarded
 * unchanged, with the editor service over an HTML string in and out.
 */
export type RichTextContext = EditorContext<string, string>;

/**
 * Slots of the rich text: the editor's, relayed.
 */
export type RichTextSlots = EditorSlots<string, string>;

/**
 * A rich text instance as data: props plus emit listeners.
 */
export type RichTextDefinition = Definition<RichTextProps, RichTextEmits>;
