// Pure util: the runtime behind every composite `define*`. Each source
// shape is a logic path — plain passes through, ref and getter become a
// computed that tracks the source.
import { describe, expect, it } from "vitest";
import { isRef, ref } from "vue";
import { define } from "../../src/utils/definition";
import { defineSelect } from "../../src/definitions/select";

describe("define", () => {
  it("returns a plain definition by identity", () => {
    const definition = { placeholder: "Pick" };
    expect(define(definition)).toBe(definition);
  });

  it("turns a getter into a computed that tracks its dependencies", () => {
    const placeholder = ref("Pick");
    const definition = define(() => ({ placeholder: placeholder.value }));
    if (!isRef(definition)) throw new Error("expected a computed definition");
    expect(definition.value).toEqual({ placeholder: "Pick" });
    placeholder.value = "Choose";
    expect(definition.value).toEqual({ placeholder: "Choose" });
  });

  it("turns a ref into a computed over the ref's value", () => {
    const source = ref({ placeholder: "Pick" });
    const definition = define(source);
    if (!isRef(definition)) throw new Error("expected a computed definition");
    expect(definition).not.toBe(source);
    expect(definition.value).toEqual({ placeholder: "Pick" });
    source.value = { placeholder: "Choose" };
    expect(definition.value).toEqual({ placeholder: "Choose" });
  });

  it("composite definers route both forms through it", () => {
    const options = ref([{ label: "A", value: "a" }]);
    const plain = { options: options.value };
    expect(defineSelect(plain)).toBe(plain);

    const reactive = defineSelect(() => ({ options: options.value }));
    expect(reactive.value.options).toHaveLength(1);
    options.value = [...options.value, { label: "B", value: "b" }];
    expect(reactive.value.options).toHaveLength(2);
  });
});
