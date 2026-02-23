export type SegmentedControlProps = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
};

export type SegmentedControlEmits = {};

export const defineSegmentedControl = useComponentRecipe<
  SegmentedControlProps,
  SegmentedControlEmits & FocusEvents
>();
