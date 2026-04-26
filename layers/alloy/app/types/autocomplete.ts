export interface AutocompleteItem {
  label: string;
  value: string;
  disabled?: boolean;
  hasChildren?: boolean;
  icon?: IconAlias;
}

export type AutocompletePassthrough = {
  root?: Passthrough<GroupProps>;
  hintWrap?: Passthrough<GroupProps>;
  hintText?: Passthrough<SpanProps>;
  hintChar?: Passthrough<SpanProps>;
  input?: Passthrough<InputProps>;
  dropdown?: Passthrough<GroupProps>;
  panel?: Passthrough<GroupProps>;
  scroller?: Passthrough<ScrollerProps, ScrollerEmits>;
  item?: Passthrough<ButtonProps>;
  itemIcon?: Passthrough<IconProps>;
  itemLabel?: Passthrough<SpanProps>;
  itemArrow?: Passthrough<IconProps>;
  empty?: Passthrough<SpanProps>;
};

export type AutocompleteProps = {
  modelValue: string;
  suggestions: AutocompleteItem[];
  steps?: AutocompleteItem[];
  hint?: string;
  showEmpty?: boolean;
  placeholder?: string;
  pt?: AutocompletePassthrough;
};

export type AutocompleteEmits = {
  "update:modelValue": [value: string];
  select: [item: AutocompleteItem];
  unwind: [panelIndex: number];
  submit: [value: string];
  keydown: [event: KeyboardEvent];
  focus: [];
  blur: [];
};
