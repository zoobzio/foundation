import type { FormFieldSlots } from "#foundation/types/data/form/field";

/**
 * The field-level slot names the form widget relays to each field.
 */
export const FORM_FIELD_SLOTS: (keyof FormFieldSlots<unknown>)[] = [
  "label",
  "input",
  "textarea",
  "select",
  "multiSelect",
  "checkbox",
  "radio",
  "datePicker",
  "tagsInput",
  "error",
];
