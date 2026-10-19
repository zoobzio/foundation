import type { Config } from "../types/data/adapter";
import type { AdapterWidgetProps } from "../types/data/adapter/widget";
import type { WidgetSettings } from "../types/widget";

type RequiredKeys<P> = {
  [K in keyof P]-?: {} extends Pick<P, K> ? never : K;
}[keyof P];

/**
 * The static description `useAdapter` instances: the contract's component
 * and exhaustive emit acknowledgment plus the base props. Reusable — one
 * definition, many ids, many override layers.
 */
export type AdapterDefinition<P extends object> = Config<P> & {
  settings?: WidgetSettings<AdapterWidgetProps<P>>;
};

/**
 * Declares an adaptation at module scope — the general constructor for
 * arbitrary components; composite helpers (`defineDirectory`, …) are sugar
 * over it. This is where the contract is enforced: the component must
 * implement it, `emits` must acknowledge every listener prop it declares,
 * and `settings` is mandatory when the contract has required props.
 */
export const defineAdapter = <P extends object>(
  definition: Config<P> &
    ([RequiredKeys<P>] extends [never]
      ? { settings?: WidgetSettings<AdapterWidgetProps<P>> }
      : { settings: WidgetSettings<AdapterWidgetProps<P>> }),
): AdapterDefinition<P> => definition;
