import type { EditorTool } from "../types/components/editor";
import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import type { Service } from "@zoobzio/editor";

import { computed, onBeforeUnmount, ref, toValue, watch } from "vue";
import { html } from "@zoobzio/editor";
import { editorTools } from "../utils/editor";

/**
 * The editor's view model over a host element: the document as static
 * markup until the user interacts, the toolbar's tools, and `activate`,
 * which turns the editor on over the host in place. `editor.vue` is one
 * rendering of it; a consumer's own component is another.
 *
 * The markup is the document through the editor's `html` codec. It follows
 * `load` while the editor is off and freezes at mount, so a view that binds
 * it never writes into the host once the editor owns it. `activate` mounts
 * the service's editor over the host: the host itself becomes the editor's
 * DOM and its children are reconciled, so the switch has no visible
 * change. A pointer lets the browser place the caret through the mousedown
 * that follows; keyboard focus starts at the top. The editor unmounts with
 * the scope.
 *
 * @param service - The editor service.
 * @param host - The element the editor takes over. Bind `markup` to its
 * `innerHTML`, `activate` to its `pointerdown` and `focus`, and give it a
 * `tabindex` so the keyboard reaches it.
 */
export const useEditor = <I, O>(
  service: Service<I, O>,
  host: MaybeRefOrGetter<HTMLElement | null>,
): {
  markup: Ref<string>;
  tools: ComputedRef<EditorTool[]>;
  activate: (event?: Event) => void;
} => {
  const render = () => html.write(service.json, service.context);
  const markup = ref(render());
  watch(
    () => service.revision,
    () => {
      if (!service.mounted) markup.value = render();
    },
  );

  const tools = computed(() => editorTools(service));

  const activate = (event?: Event) => {
    const element = toValue(host);
    if (service.mounted || !element) return;
    service.mount(element);
    if (event?.type === "focus") service.focus("start");
  };

  onBeforeUnmount(() => {
    service.unmount();
  });

  return { markup, tools, activate };
};
