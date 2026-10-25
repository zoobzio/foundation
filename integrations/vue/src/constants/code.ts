import type { CodeEmits } from "../types/components/code";

/** The service events the code editor relays as emits. Each is a declared emit. */
export const CODE_EVENTS = [
  "loaded",
  "updated",
  "mounted",
  "unmounted",
] as const satisfies readonly (keyof CodeEmits)[];

/** The class of the static copy of the text, a `pre` in the host. */
export const CODE_STATIC_CLASS = "f-data-code-static";

export const CODE_LINE_LABEL = "Ln";
export const CODE_COLUMN_LABEL = "Col";
