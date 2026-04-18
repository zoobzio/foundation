export type RadioProps = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
};

export type RadioEmits = {};

export const defineRadio = useComponentRecipe<
  RadioProps,
  RadioEmits & FocusEvents
>();

export type RadioRecipe = ComponentRecipe<RadioProps, RadioEmits & FocusEvents>;
