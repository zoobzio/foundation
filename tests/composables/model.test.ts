import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useModel } from "#foundation/composables/model";

describe("useModel", () => {
  it("reads undefined when no prop and no default", () => {
    const prop = ref<string | undefined>(undefined);
    const model = useModel(
      () => prop.value,
      () => {},
    );
    expect(model.value).toBeUndefined();
  });

  it("reads the default when no prop is provided", () => {
    const prop = ref<boolean | undefined>(undefined);
    const model = useModel(
      () => prop.value,
      () => {},
      { default: false },
    );
    expect(model.value).toBe(false);
  });

  it("prefers the prop over the default", () => {
    const prop = ref<boolean | undefined>(true);
    const model = useModel(
      () => prop.value,
      () => {},
      { default: false },
    );
    expect(model.value).toBe(true);
  });

  it("tracks prop changes reactively", () => {
    const prop = ref<string | undefined>(undefined);
    const model = useModel(
      () => prop.value,
      () => {},
    );
    expect(model.value).toBeUndefined();
    prop.value = "controlled";
    expect(model.value).toBe("controlled");
  });

  it("treats null as not provided", () => {
    const prop = ref<string | null | undefined>(null);
    const model = useModel(
      () => prop.value,
      () => {},
      { default: "fallback" },
    );
    expect(model.value).toBe("fallback");
  });

  it("writes update internal state and emit while uncontrolled", () => {
    const prop = ref<string | undefined>(undefined);
    const emitted: string[] = [];
    const model = useModel(
      () => prop.value,
      (v) => emitted.push(v),
    );
    model.value = "chosen";
    expect(emitted).toEqual(["chosen"]);
    expect(model.value).toBe("chosen");
  });

  it("writes emit but reads stay pinned to the prop while controlled", () => {
    const prop = ref<string | undefined>("pinned");
    const emitted: string[] = [];
    const model = useModel(
      () => prop.value,
      (v) => emitted.push(v),
    );
    model.value = "attempted";
    expect(emitted).toEqual(["attempted"]);
    expect(model.value).toBe("pinned");
  });

  it("keeps the last written value when the prop is withdrawn", () => {
    const prop = ref<string | undefined>("controlled");
    const model = useModel(
      () => prop.value,
      () => {},
    );
    model.value = "written";
    prop.value = undefined;
    expect(model.value).toBe("written");
  });
});
