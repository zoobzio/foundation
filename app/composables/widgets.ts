import type { AnyWiring } from "#foundation/types/definition";
import type { ScopedEvent } from "#foundation/types/hook";
import type { AnyWidget, Widgets } from "#foundation/types/widget";

import { entries } from "objectively";
import { useHooks } from "#foundation/composables/hook";

/**
 * Resolves a definition's widget registry once, in setup, where factories may run.
 * Structures render through the erased view — correlation was proven per
 * factory.
 */
export const useWidgets = <R extends Widgets>(
  registry: R,
): Record<string, AnyWidget> => {
  const widgets: Record<string, AnyWidget> = {};
  for (const [key, make] of entries(registry)) {
    widgets[String(key)] = make();
  }
  return widgets;
};

/**
 * Registers a definition's wiring over the resolved registry: each handler
 * subscribes to its machine's domain event through the hooks backbone,
 * id-scoped, torn down with the scope. Handlers receive the full services
 * record so an event in one widget can drive actions in another.
 */
export const useWiring = (
  wire: AnyWiring | undefined,
  widgets: Record<string, AnyWidget>,
): void => {
  if (!wire) return;

  const services: Record<string, unknown> = {};
  for (const [key, widget] of entries(widgets)) {
    services[key] = widget.service;
  }

  for (const [key, handlers] of entries(wire)) {
    const widget = widgets[key];
    if (!widget || !handlers) continue;

    const listeners: Record<string, (event: ScopedEvent) => void> = {};
    for (const [hook, handler] of entries(handlers)) {
      if (!handler) continue;
      listeners[hook] = (event) => handler(event, services);
    }

    useHooks(widget.service.id, listeners);
  }
};
