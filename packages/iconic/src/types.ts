// @ts-expect-error only available at runtime within a module
import aliases from "#build/iconic.config.mjs";

export type Iconic = typeof aliases;
export type IconAlias = keyof Iconic;
