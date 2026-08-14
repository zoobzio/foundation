import type { Service } from "#foundation/types/data/adapter";

/**
 * One deviation from the data-tier norm: `pt` is the wrapped component's own
 * props, not a passthrough manifest — the adapted component's props *are* its
 * settings surface, so factory `settings` flow through the standard
 * `:pt="toValue(widget.settings)"` bind untouched. The widget layers the
 * service's `patch` overrides on top and wraps declared emit listeners with
 * the hook-bus bridge.
 */
export type AdapterWidgetProps<P extends object> = {
  service: Service<P>;
  pt?: P;
};
