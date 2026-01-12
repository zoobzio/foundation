export type ComponentEmits = Record<string, unknown[]>;

export type ComponentHandlers<TEmits extends ComponentEmits> = {
  [K in keyof TEmits]?: (...args: TEmits[K]) => Promise<void> | void;
};

export const useComponentRecipe =
  <TProps, TEmits extends ComponentEmits>() =>
  (props: TProps, handlers: ComponentHandlers<TEmits> = {}) => {
    return {
      props,
      handlers,
    };
  };
