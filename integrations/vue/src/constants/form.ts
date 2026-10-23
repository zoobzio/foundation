import type { FormEmits } from "../types/components/form";
import type { TemporalField } from "@zoobzio/form";

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

/**
 * The native `type` of a temporal field. `date-input` renders a native
 * date input; the `date` name belongs to the `Date`-valued picker.
 */
export const FORM_TEMPORAL_TYPES = {
  time: "time",
  "datetime-local": "datetime-local",
  "date-input": "date",
} as const satisfies Record<TemporalField<unknown>["type"], string>;
