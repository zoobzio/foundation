import type { MaybeRefOrGetter, Ref } from "vue";
import type { Service } from "@zoobzio/code";

import { onBeforeUnmount, ref, toValue, watch } from "vue";
import { codeMarkup } from "../utils/code";

/**
 * The code editor's view model over a host element: the text as static
 * markup until the user interacts, and `activate`, which turns the editor
 * on in the host. `code.vue` is one rendering of it; a consumer's own
 * component is another.
 *
 * The markup is the text in a `pre`. It follows `load` while the editor is
 * off and freezes at mount, so a view that binds it never writes into the
 * host once the editor owns it. `activate` mounts the service's view in the
 * host: the view's DOM replaces the static copy, and the text reads the
 * same. A pointer places the caret at the point it pressed, through the
 * service's `locate`, and its mouse events are suppressed so they do not
 * land on the copy that is gone; keyboard focus starts at the top. The
 * editor unmounts with the scope.
 *
 * @param service - The code service.
 * @param host - The element the editor mounts in. Bind `markup` to its
 * `innerHTML`, `activate` to its `pointerdown` and `focus`, and give it a
 * `tabindex` so the keyboard reaches it.
 */
export const useCode = <I, O>(
  service: Service<I, O>,
  host: MaybeRefOrGetter<HTMLElement | null>,
): {
  markup: Ref<string>;
  activate: (event?: Event) => void;
} => {
  const render = () => codeMarkup(service.text);
  const markup = ref(render());
  watch(
    () => service.revision,
    () => {
      if (!service.mounted) markup.value = render();
    },
  );

  const activate = (event?: Event) => {
    const element = toValue(host);
    if (service.mounted || !element) return;
    service.mount(element);
    if (event?.type === "focus") {
      service.focus("start");
    } else if (event instanceof MouseEvent) {
      event.preventDefault();
      const at = service.locate({ x: event.clientX, y: event.clientY });
      service.focus(at ?? "start");
    }
  };

  onBeforeUnmount(() => {
    service.unmount();
  });

  return { markup, activate };
};
