// The toast wrapper: `close` before its close label.
import Toaster from "@zoobzio/vue/components/toaster.vue";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import Toast from "../../../app/components/toast";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("toast wrapper", () => {
  it("draws close before the close label", async () => {
    const Host = defineComponent({
      render: () =>
        h(Toaster, null, {
          toasts: () => h(Toast, { title: "Saved", open: true }),
        }),
    });
    const wrapper = mount(Host, { attachTo: document.body });
    mounted.push(wrapper);
    await flushPromises();
    const close = document.body.querySelector(".f-toast-close");
    expect(
      close?.querySelector("svg[data-icon]")?.getAttribute("data-icon"),
    ).toBe("close");
    expect(close?.textContent).toBe("Close");
  });
});
