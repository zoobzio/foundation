export type AlertVariant = "note" | "tip" | "important" | "warning" | "caution";

export type AlertProps = {
  icon?: IconAlias;
  variant?: AlertVariant;
};

export type AlertEmits = {};

export const defineAlert = useComponentRecipe<AlertProps, AlertEmits>();
