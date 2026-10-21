// The generic facade. A fixture class exercises each surface kind:
// ref-backed getters (readonly, computed), a get/set accessor pair
// (writable, routes through the setter), own data fields, and methods
// (excluded from the view).
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useRefs } from "../../src/composables/ref";

const makeService = () => {
  const onSet = vi.fn();

  class FixtureService {
    public readonly id = "fixture";
    private readonly state = { count: ref(0), label: ref("initial") };

    get count(): number {
      return this.state.count.value;
    }

    get double(): number {
      return this.state.count.value * 2;
    }

    get label(): string {
      return this.state.label.value;
    }

    set label(value: string) {
      onSet(value);
      this.state.label.value = value;
    }

    increment(): void {
      this.state.count.value += 1;
    }
  }

  return { service: new FixtureService(), onSet };
};

describe("useRefs", () => {
  it("mirrors getters as computeds tracking service mutations", () => {
    const { service } = makeService();
    const { count, double } = useRefs(service);
    expect(count.value).toBe(0);
    expect(double.value).toBe(0);
    service.increment();
    expect(count.value).toBe(1);
    expect(double.value).toBe(2);
  });

  it("get/set pairs become writable computeds routing through the setter", () => {
    const { service, onSet } = makeService();
    const { label } = useRefs(service);
    label.value = "updated";
    expect(onSet).toHaveBeenCalledWith("updated");
    expect(service.label).toBe("updated");
    expect(label.value).toBe("updated");
  });

  it("mirrors own data fields read-only", () => {
    const { service } = makeService();
    const { id } = useRefs(service);
    expect(id.value).toBe("fixture");
  });

  it("excludes methods from the view", () => {
    const { service } = makeService();
    const refs = useRefs(service);
    expect("increment" in refs).toBe(false);
  });

  it("separate views over one service stay coherent", () => {
    const { service } = makeService();
    const a = useRefs(service);
    const b = useRefs(service);
    service.increment();
    expect(a.count.value).toBe(1);
    expect(b.count.value).toBe(1);
  });
});
