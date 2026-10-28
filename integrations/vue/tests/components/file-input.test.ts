import type { FileInputProps } from "../../src/types/components/file-input";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import FileInput from "../../src/components/file-input.vue";
import { fakeFile } from "#test/data/form";

const mounted: { unmount: () => void }[] = [];

const mountInput = (
  props: FileInputProps = {},
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(FileInput, { props, slots, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

/**
 * Picks files through the native input: `files` is read-only, so the test
 * defines it, then fires `change` as the browser would.
 */
const pick = async (wrapper: ReturnType<typeof mountInput>, files: File[]) => {
  const input = wrapper.get<HTMLInputElement>("input.f-file-input-input");
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
});

describe("file-input", () => {
  it("renders a native file input with its attributes", () => {
    const wrapper = mountInput({
      accept: "image/*",
      capture: "user",
      required: true,
      name: "avatar",
    });
    const input = wrapper.get("input.f-file-input-input");
    expect(input.attributes("type")).toBe("file");
    expect(input.attributes("accept")).toBe("image/*");
    expect(input.attributes("capture")).toBe("user");
    expect(input.attributes("required")).toBeDefined();
    expect(input.attributes("name")).toBe("avatar");
    expect(input.attributes("multiple")).toBeUndefined();
    expect(wrapper.findAll(".f-file-input-item")).toHaveLength(0);
  });

  it("lists the model's files by name", () => {
    const wrapper = mountInput({
      modelValue: [fakeFile("a.png"), fakeFile("b.png")],
      multiple: true,
    });
    expect(
      wrapper.findAll(".f-file-input-item-name").map((n) => n.text()),
    ).toEqual(["a.png", "b.png"]);
  });

  it("a pick emits the files, one at most unless multiple", async () => {
    const single = mountInput();
    const a = fakeFile("a.png");
    const b = fakeFile("b.png");
    await pick(single, [a, b]);
    expect(single.emitted("update:modelValue")).toEqual([[[a]]]);
    expect(single.get(".f-file-input-item-name").text()).toBe("a.png");

    const many = mountInput({ multiple: true });
    await pick(many, [a, b]);
    expect(many.emitted("update:modelValue")).toEqual([[[a, b]]]);
    expect(many.findAll(".f-file-input-item")).toHaveLength(2);
  });

  it("removing an item drops it from the model and clears the native list", async () => {
    const a = fakeFile("a.png");
    const b = fakeFile("b.png");
    const wrapper = mountInput({ multiple: true });
    const input = await pick(wrapper, [a, b]);
    await wrapper.findAll(".f-file-input-item-remove")[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([[b]]);
    expect(
      wrapper.findAll(".f-file-input-item-name").map((n) => n.text()),
    ).toEqual(["b.png"]);
    expect(input.element.value).toBe("");
  });

  it("follows a controlled model and clears the native list when emptied", async () => {
    const a = fakeFile("a.png");
    const wrapper = mountInput({ modelValue: [a] });
    expect(wrapper.get(".f-file-input-item-name").text()).toBe("a.png");
    await wrapper.setProps({ modelValue: [] });
    expect(wrapper.findAll(".f-file-input-item")).toHaveLength(0);
    expect(
      wrapper.get<HTMLInputElement>("input.f-file-input-input").element.value,
    ).toBe("");
  });

  it("disabled reaches the input and the remove buttons", () => {
    const wrapper = mountInput({ modelValue: [fakeFile()], disabled: true });
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
    expect(
      wrapper.get(".f-file-input-item-remove").attributes("disabled"),
    ).toBeDefined();
  });

  it("serves ctx to the slots, with the file on item slots", () => {
    const wrapper = mountInput(
      { modelValue: [fakeFile("a.png")] },
      {
        itemName: `<template #itemName="{ file, multiple }">
          <output>{{ file.name }}:{{ multiple }}</output>
        </template>`,
      },
    );
    expect(wrapper.get("output").text()).toBe("a.png:false");
  });

  it("passthrough reaches each part", () => {
    const wrapper = mountInput({
      modelValue: [fakeFile("a.png")],
      pt: {
        root: { id: "root" },
        input: { id: "picker" },
        item: (file) => ({ title: file.name }),
        itemRemove: () => ({ "aria-label": "Drop" }),
      },
    });
    expect(wrapper.get(".f-file-input-root").attributes("id")).toBe("root");
    expect(wrapper.get("input").attributes("id")).toBe("picker");
    expect(wrapper.get(".f-file-input-item").attributes("title")).toBe("a.png");
    expect(
      wrapper.get(".f-file-input-item-remove").attributes("aria-label"),
    ).toBe("Drop");
  });

  it("exposes the context", () => {
    const wrapper = mountInput({ multiple: true, accept: "image/*" });
    const ctx = (
      wrapper.vm as unknown as {
        ctx: { id: string; multiple: boolean; accept?: string };
      }
    ).ctx;
    expect(ctx.id).toBe("file-input");
    expect(ctx.multiple).toBe(true);
    expect(ctx.accept).toBe("image/*");
  });
});
