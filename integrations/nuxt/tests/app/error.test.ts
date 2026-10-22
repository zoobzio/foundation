// The error page: the status code falls back when the error carries none,
// a 404 gets its own message, and the action clears the error home.
import type { NuxtError } from "#app";

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { clearError } from "#imports";
import ErrorPage from "../../app/error.vue";

const makeError = (overrides: Partial<NuxtError> = {}): NuxtError =>
  ({ message: "", ...overrides }) as NuxtError;

describe("error.vue", () => {
  it("renders the error's status code and message", () => {
    const wrapper = mount(ErrorPage, {
      props: { error: makeError({ statusCode: 403, message: "Forbidden" }) },
    });
    expect(wrapper.find(".f-error-code").text()).toBe("403");
    expect(wrapper.find(".f-error-message").text()).toBe("Forbidden");
  });

  it("falls back to 500 and a generic message", () => {
    const wrapper = mount(ErrorPage, { props: { error: makeError() } });
    expect(wrapper.find(".f-error-code").text()).toBe("500");
    expect(wrapper.find(".f-error-message").text()).toBe(
      "Something went wrong.",
    );
  });

  it("describes a 404 regardless of the error's message", () => {
    const wrapper = mount(ErrorPage, {
      props: { error: makeError({ statusCode: 404, message: "Nope" }) },
    });
    expect(wrapper.find(".f-error-message").text()).toBe(
      "The page you're looking for doesn't exist.",
    );
  });

  it("clears the error home on the action", async () => {
    const wrapper = mount(ErrorPage, { props: { error: makeError() } });
    await wrapper.find(".f-error-action").trigger("click");
    expect(clearError).toHaveBeenCalledWith({ redirect: "/" });
  });
});
