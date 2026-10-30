// The app shell: the page renders inside the providers and the error
// boundary, and a boundary error becomes a toast — the error's own
// notification when it carries one, its message otherwise.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { createError } from "#app";
import { useNotifications } from "../../app/composables/notification";
import App from "../../app/app.vue";

const ToastStub = defineComponent({
  name: "Toast",
  props: { title: String, description: String, variant: String },
  emits: ["close"],
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        {
          class: "toast",
          "data-variant": props.variant,
          onClick: () => emit("close"),
        },
        [props.title, props.description].filter(Boolean).join(" / "),
      );
  },
});

const ToasterStub = defineComponent({
  name: "Toaster",
  setup(_, { slots }) {
    return () => h("div", { class: "toaster" }, slots.toasts?.());
  },
});

const mountApp = () =>
  mount(App, {
    global: {
      stubs: {
        Toast: ToastStub,
        Toaster: ToasterStub,
        NuxtPage: { template: '<main class="page" />' },
      },
    },
  });

const raise = (wrapper: ReturnType<typeof mountApp>, err: unknown) => {
  wrapper.findComponent({ name: "NuxtErrorBoundary" }).vm.$emit("error", err);
  return wrapper.vm.$nextTick();
};

describe("app.vue", () => {
  it("renders the page inside the shell", () => {
    const wrapper = mountApp();
    const indicator = wrapper.find(".nuxt-loading-indicator");
    expect(indicator.exists()).toBe(true);
    // The theme names the indicator's color; the shell never picks a role.
    expect(indicator.attributes("data-color")).toBe("var(--loading-indicator)");
    expect(wrapper.find("main.page").exists()).toBe(true);
    expect(wrapper.findAll(".toast")).toHaveLength(0);
  });

  it("renders the queue as toasts and dismisses on close", async () => {
    const wrapper = mountApp();
    const { notifications, push } = useNotifications();
    push({ variant: "success", title: "Saved", description: "All good" });
    await wrapper.vm.$nextTick();
    const toast = wrapper.find(".toast");
    expect(toast.text()).toBe("Saved / All good");
    expect(toast.attributes("data-variant")).toBe("success");
    await toast.trigger("click");
    expect(notifications.value).toEqual([]);
    expect(wrapper.findAll(".toast")).toHaveLength(0);
  });

  it("toasts an error's own notification when it carries one", async () => {
    const wrapper = mountApp();
    const err = createError({
      message: "raw",
      data: { notification: { variant: "warning", title: "Careful" } },
    });
    await raise(wrapper, err);
    const toast = wrapper.find(".toast");
    expect(toast.text()).toBe("Careful");
    expect(toast.attributes("data-variant")).toBe("warning");
  });

  it("toasts a plain error's message", async () => {
    const wrapper = mountApp();
    await raise(wrapper, new Error("Boom"));
    const toast = wrapper.find(".toast");
    expect(toast.text()).toBe("Boom");
    expect(toast.attributes("data-variant")).toBe("error");
  });

  it("toasts a generic message for a non-error throw", async () => {
    const wrapper = mountApp();
    await raise(wrapper, "nope");
    expect(wrapper.find(".toast").text()).toBe("An unexpected error occurred");
  });
});
