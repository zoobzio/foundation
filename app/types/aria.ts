import type { AriaAttributes } from "vue";
import type { GlobalAria, ProhibitedAria, RoleAria } from "#build/types/a11y";
import type { Component } from "#foundation/types/component";
import type roles from "#config/roles";

type AllAria = {
  [K in keyof AriaAttributes as K extends `aria-${infer Name}`
    ? Name
    : never]?: AriaAttributes[K];
};

export type AriaRole<C extends Component> = (typeof roles)[C];

export type AriaBindings<C extends Component> = {
  [K in keyof AriaProps<C> as `aria-${K & string}`]?: AriaProps<C>[K];
};

export type AriaProps<C extends Component> = Pick<
  AllAria,
  Exclude<GlobalAria | RoleAria[AriaRole<C>], ProhibitedAria[AriaRole<C>]> &
    keyof AllAria
>;
