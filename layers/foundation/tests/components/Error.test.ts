import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { oreStubs } from "@zoobz-io/ore/stubs";

const ErrorComponent = (await import("../../app/error.vue")).default as DefineComponent;

const factory = (statusCode = 500, message = "Something went wrong") =>
  shallowMount(ErrorComponent, {
    props: {
      error: { statusCode, message } as { statusCode: number; message: string },
    },
    global: { stubs: oreStubs },
  });

describe("error.vue", () => {
  it("renders with f-error-page class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-error-page").exists()).toBe(true);
  });

  it("displays the status code", () => {
    const wrapper = factory(404);
    expect(wrapper.find(".f-error-code").text()).toBe("404");
  });

  it("displays custom message for 404", () => {
    const wrapper = factory(404);
    expect(wrapper.find(".f-error-message").text()).toBe("The page you're looking for doesn't exist.");
  });

  it("displays the error message for non-404 errors", () => {
    const wrapper = factory(500, "Server exploded");
    expect(wrapper.find(".f-error-message").text()).toBe("Server exploded");
  });

  it("displays fallback message when none provided", () => {
    const wrapper = shallowMount(ErrorComponent, {
      props: {
        error: { statusCode: 500 } as { statusCode: number; message: string },
      },
      global: { stubs: oreStubs },
    });
    expect(wrapper.find(".f-error-message").text()).toBe("Something went wrong.");
  });

  it("calls clearError on button click", async () => {
    const wrapper = factory();
    await wrapper.find(".f-error-action").trigger("click");
    expect(clearError).toHaveBeenCalledWith({ redirect: "/" });
  });
});
