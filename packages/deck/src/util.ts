import { DECK_SORT_LABELS } from "./constants";

/** The title label of a sort field: a known label, else capitalized. */
export const sortLabel = (field: string): string =>
  DECK_SORT_LABELS[field] ?? field.charAt(0).toUpperCase() + field.slice(1);
