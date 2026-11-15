import type { ViewsEmits } from "../types/components/views";
import type { Intent } from "@zoobzio/views";

/** The service events the views relay as emits. Each is a declared emit. */
export const VIEWS_EVENTS = [
  "selected",
  "saved",
  "renamed",
  "removed",
  "reverted",
  "failed",
] as const satisfies readonly (keyof ViewsEmits<unknown>)[];

/** The actions of the active view, in the order the menu lists them. */
export const VIEWS_ACTIONS = [
  "save",
  "saveAs",
  "rename",
  "revert",
  "remove",
] as const;

export const VIEWS_ACTION_LABELS: Record<
  (typeof VIEWS_ACTIONS)[number],
  string
> = {
  save: "Save",
  saveAs: "Save as...",
  rename: "Rename",
  revert: "Discard changes",
  remove: "Delete",
};

export const VIEWS_MENU_LABEL = "View";
export const VIEWS_DRIFTED_LABEL = "Edited";
export const VIEWS_CANCEL_LABEL = "Cancel";
export const VIEWS_SAVE_LABEL = "Save";
export const VIEWS_NAME_LABEL = "Name";

/** The confirmation of each pending intent: its title and what it says. */
export const VIEWS_CONFIRM_TITLES: Record<Intent["kind"], string> = {
  select: "Save your changes?",
  revert: "Discard your changes?",
  remove: "Delete this view?",
};

export const VIEWS_CONFIRM_DESCRIPTIONS: Record<Intent["kind"], string> = {
  select: "This view has changes that are not saved.",
  revert: "The view goes back to how it was last saved.",
  remove: "The view is deleted for good.",
};

/** The button that carries each pending intent out as it stands. */
export const VIEWS_PROCEED_LABELS: Record<Intent["kind"], string> = {
  select: "Discard",
  revert: "Discard",
  remove: "Delete",
};

/** The dialog that names a view: a new one, or one being renamed. */
export const VIEWS_NAMING_TITLES: Record<"saveAs" | "rename", string> = {
  saveAs: "Save as a new view",
  rename: "Rename this view",
};

export const VIEWS_NAMING_DESCRIPTION = "Give the view a name.";
