import type { ImageInputProps } from "../../src/types/components/image-input";

import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ImageInput from "../../src/components/image-input.vue";
import { fakeFile } from "#test/data/form";

const mounted: { unmount: () => void }[] = [];

const mountInput = (
  props: ImageInputProps = {},
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(ImageInput, { props, slots, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

/**
 * Picks files through the native input: `files` is read-only, so the test
 * defines it, then fires `change` as the browser would.
 */
const pick = async (wrapper: ReturnType<typeof mountInput>, files: File[]) => {
  const input = wrapper.get<HTMLInputElement>("input.f-image-input-input");
  Object.defineProperty(input.element, "files", {
    value: files,
    configurable: true,
  });
  await input.trigger("change");
  return input;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("image-input", () => {
  it("renders a native file input that accepts images by default", () => {
    const wrapper = mountInput({ capture: "user", name: "photo" });
    const input = wrapper.get("input.f-image-input-input");
    expect(input.attributes("type")).toBe("file");
    expect(input.attributes("accept")).toBe("image/*");
    expect(input.attributes("capture")).toBe("user");
    expect(input.attributes("name")).toBe("photo");
    expect(
      mountInput({ accept: "image/png" }).get("input").attributes("accept"),
    ).toBe("image/png");
  });

  it("shows the placeholder and no remove button while there is no image", () => {
    const wrapper = mountInput();
    expect(wrapper.find(".f-image-input-placeholder").exists()).toBe(true);
    expect(wrapper.find(".f-image-input-preview").exists()).toBe(false);
    expect(wrapper.find(".f-image-input-remove").exists()).toBe(false);
    expect(wrapper.get(".f-image-input-pick").text()).toBe("Choose");
  });

  it("previews a stored image by its URL", () => {
    const create = vi.spyOn(URL, "createObjectURL");
    const wrapper = mountInput({ modelValue: "/photos/ada.png", alt: "Ada" });
    const preview = wrapper.get(".f-image-input-preview");
    expect(preview.attributes("src")).toBe("/photos/ada.png");
    expect(preview.attributes("alt")).toBe("Ada");
    expect(wrapper.find(".f-image-input-placeholder").exists()).toBe(false);
    expect(wrapper.get(".f-image-input-pick").text()).toBe("Change");
    expect(wrapper.get(".f-image-input-remove").text()).toBe("Remove");
    expect(create).not.toHaveBeenCalled();
  });

  it("an empty string reads as no image", () => {
    const wrapper = mountInput({ modelValue: "" });
    expect(wrapper.find(".f-image-input-preview").exists()).toBe(false);
    expect(wrapper.find(".f-image-input-placeholder").exists()).toBe(true);
  });

  it("the pick label opens the native input", () => {
    const wrapper = mountInput();
    const id = wrapper.get("input").attributes("id");
    expect(id).toBeTruthy();
    expect(wrapper.get(".f-image-input-pick").attributes("for")).toBe(id);
    const wired = mountInput({ pt: { input: { id: "picker" } } });
    expect(wired.get("input").attributes("id")).toBe("picker");
    expect(wired.get(".f-image-input-pick").attributes("for")).toBe("picker");
  });

  it("a pick emits the first file and previews it through an object URL", async () => {
    const wrapper = mountInput();
    const a = fakeFile("a.png");
    await pick(wrapper, [a, fakeFile("b.png")]);
    expect(wrapper.emitted("update:modelValue")).toEqual([[a]]);
    expect(wrapper.get(".f-image-input-preview").attributes("src")).toMatch(
      /^blob:/,
    );
  });

  it("a cancelled pick leaves the image as it is", async () => {
    const wrapper = mountInput({ modelValue: "/photos/ada.png" });
    await pick(wrapper, []);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.get(".f-image-input-preview").attributes("src")).toBe(
      "/photos/ada.png",
    );
  });

  it("remove emits undefined and clears the native pick", async () => {
    const wrapper = mountInput();
    const input = await pick(wrapper, [fakeFile("a.png")]);
    await wrapper.get(".f-image-input-remove").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([undefined]);
    expect(wrapper.find(".f-image-input-preview").exists()).toBe(false);
    expect(input.element.value).toBe("");
  });

  it("revokes the object URL when the model moves on and on unmount", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const wrapper = mountInput({ modelValue: fakeFile("a.png") });
    const first = wrapper.get(".f-image-input-preview").attributes("src");
    await wrapper.setProps({ modelValue: fakeFile("b.png") });
    expect(revoke).toHaveBeenCalledWith(first);
    const second = wrapper.get(".f-image-input-preview").attributes("src");
    expect(second).not.toBe(first);
    wrapper.unmount();
    expect(revoke).toHaveBeenCalledWith(second);
  });

  it("follows a controlled model back to a stored image or to none", async () => {
    const wrapper = mountInput({ modelValue: "/photos/ada.png" });
    const input = await pick(wrapper, [fakeFile("a.png")]);
    // Controlled: the preview follows the prop, as after a form reset.
    await wrapper.setProps({ modelValue: "/photos/ada.png" });
    expect(wrapper.get(".f-image-input-preview").attributes("src")).toBe(
      "/photos/ada.png",
    );
    expect(input.element.value).toBe("");
    await wrapper.setProps({ modelValue: undefined });
    expect(wrapper.find(".f-image-input-preview").exists()).toBe(false);
  });

  it("required marks the native input only while there is no image", async () => {
    const wrapper = mountInput({ required: true, modelValue: undefined });
    const input = wrapper.get("input");
    expect(input.attributes("required")).toBeDefined();
    expect(input.attributes("aria-required")).toBe("true");
    await wrapper.setProps({ modelValue: "/photos/ada.png" });
    expect(input.attributes("required")).toBeUndefined();
    expect(input.attributes("aria-required")).toBe("true");
  });

  it("disabled reaches the input and the remove button", () => {
    const wrapper = mountInput({ modelValue: "/a.png", disabled: true });
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
    expect(
      wrapper.get(".f-image-input-remove").attributes("disabled"),
    ).toBeDefined();
  });

  it("serves ctx to the slots", () => {
    const empty = mountInput(
      {},
      {
        placeholder: `<template #placeholder="{ accept }">
          <output>{{ accept }}</output>
        </template>`,
      },
    );
    expect(empty.get("output").text()).toBe("image/*");
    const filled = mountInput(
      { modelValue: "/a.png" },
      {
        preview: `<template #preview="{ src }"><output>{{ src }}</output></template>`,
        pickText: `<template #pickText="{ src }"><b>{{ src ? "Swap" : "Add" }}</b></template>`,
        removePrepend: `<i>x</i>`,
      },
    );
    const iconed = mountInput({}, { placeholderContent: `<i>none</i>` });
    expect(iconed.get(".f-image-input-placeholder i").text()).toBe("none");
    expect(filled.get("output").text()).toBe("/a.png");
    expect(filled.get(".f-image-input-pick").text()).toBe("Swap");
    expect(filled.get(".f-image-input-remove i").text()).toBe("x");
  });

  it("passthrough reaches each part", () => {
    const filled = mountInput({
      modelValue: "/a.png",
      pt: {
        root: { id: "root" },
        preview: { loading: "lazy" },
        pick: { title: "Pick" },
        remove: { "aria-label": "Drop" },
      },
    });
    expect(filled.get(".f-image-input-root").attributes("id")).toBe("root");
    expect(filled.get(".f-image-input-preview").attributes("loading")).toBe(
      "lazy",
    );
    expect(filled.get(".f-image-input-pick").attributes("title")).toBe("Pick");
    expect(filled.get(".f-image-input-remove").attributes("aria-label")).toBe(
      "Drop",
    );
    const empty = mountInput({ pt: { placeholder: { title: "None" } } });
    expect(empty.get(".f-image-input-placeholder").attributes("title")).toBe(
      "None",
    );
  });

  it("exposes the context", () => {
    const wrapper = mountInput({ modelValue: "/a.png" });
    const ctx = (
      wrapper.vm as unknown as {
        ctx: { id: string; accept: string; src?: string };
      }
    ).ctx;
    expect(ctx.id).toBe("image-input");
    expect(ctx.accept).toBe("image/*");
    expect(ctx.src).toBe("/a.png");
  });
});
