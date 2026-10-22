import type { FormEmits } from "../types/components/form";

/** The service events the form relays as emits. Each is a declared emit. */
export const FORM_EVENTS = [
  "initialized",
  "submitted",
  "rejected",
  "restored",
  "reset",
  "failed",
] as const satisfies readonly (keyof FormEmits<unknown>)[];

export const FORM_RESET_LABEL = "Reset";
export const FORM_SUBMIT_LABEL = "Submit";
export const FORM_SUBMITTING_LABEL = "Submitting...";

/** The grid columns a field spans when its config sets no `colspan`. */
export const FORM_FIELD_COLSPAN = 12;
