// The request wrappers: the async-data call with `server` set, the
// lifecycle on the logger under the key, and a failure thrown as an app
// error with the notification the shell toasts. The composable runs
// inside a child so the throw from its watcher reaches a parent's
// `errorCaptured`, as the shell's boundary would.
import type { AppError } from "../../../app/types/error";
import type { RequestOptions } from "../../../app/types/request";

import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { useLogger } from "../../../app/composables/log";
import { useLazyRequest, useRequest } from "../../../app/composables/request";

type Wrapper = typeof useRequest;

const run = <T>(
  wrapper: Wrapper,
  handler: () => Promise<T>,
  opts?: RequestOptions<T, T>,
) => {
  const captured: unknown[] = [];
  let results: ReturnType<Wrapper> | undefined;
  const Child = defineComponent({
    setup() {
      results = wrapper("orders", handler, opts);
      return () => h("div");
    },
  });
  const Host = defineComponent({
    errorCaptured(err) {
      captured.push(err);
      return false;
    },
    setup() {
      return () => h(Child);
    },
  });
  mount(Host);
  if (!results) throw new Error("request not started");
  return { results, captured };
};

const isAppError = (err: unknown): err is AppError =>
  err instanceof Error && "statusCode" in err;

describe("useRequest / useLazyRequest", () => {
  it("passes the options through with server set by the wrapper", () => {
    const blocking = run(useRequest, async () => 1, { default: () => 0 });
    const lazy = run(useLazyRequest, async () => 1);
    expect(blocking.results.options).toMatchObject({ server: true });
    expect(blocking.results.options).toHaveProperty("default");
    expect(blocking.results.options).not.toHaveProperty("error");
    expect(lazy.results.options).toEqual({ server: false });
  });

  it("resolves the data and logs the lifecycle under the key", async () => {
    const log = useLogger();
    log.level.value = "debug";
    const { results, captured } = run(useLazyRequest, async () => [1, 2]);
    await flushPromises();
    expect(results.data.value).toEqual([1, 2]);
    expect(captured).toEqual([]);
    const lines = log.backlog.value.filter((line) => line.name === "orders");
    expect(lines.map((line) => [line.level, line.message])).toEqual([
      ["debug", "Request started"],
      ["debug", "Request finished"],
    ]);
    expect(lines[1]?.data).toMatchObject({
      status: "success",
      results: [1, 2],
    });
  });

  it("throws a non-fatal app error with a default notification on a lazy failure", async () => {
    const log = useLogger();
    const { captured } = run(useLazyRequest, async () => {
      throw new Error("boom");
    });
    await flushPromises();
    expect(captured).toHaveLength(1);
    const err = captured[0];
    if (!isAppError(err)) throw new Error("not an app error");
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe("Request failed");
    expect(err.fatal).toBe(false);
    expect(err.cause).toBeInstanceOf(Error);
    expect(err.data?.notification).toEqual({
      title: "An unknown error occurred",
      variant: "error",
      description: "boom",
    });
    expect(
      log.backlog.value.map((line) => [line.name, line.level, line.message]),
    ).toEqual([["orders", "error", "Request failed"]]);
  });

  it("throws a fatal error on a blocking failure, shaped by the error option", async () => {
    const cause = new Error("upstream");
    const { captured } = run(
      useRequest,
      async () => {
        throw new Error("boom");
      },
      {
        error: {
          status: 502,
          message: "Orders are unavailable",
          notification: { variant: "warning", title: "Try later" },
          cause,
        },
      },
    );
    await flushPromises();
    const err = captured[0];
    if (!isAppError(err)) throw new Error("not an app error");
    expect(err.statusCode).toBe(502);
    expect(err.statusText).toBe("Bad Gateway");
    expect(err.message).toBe("Orders are unavailable");
    expect(err.fatal).toBe(true);
    expect(err.cause).toBe(cause);
    expect(err.data?.notification).toEqual({
      variant: "warning",
      title: "Try later",
    });
  });

  it("honors an explicit fatal flag over the wrapper's default", async () => {
    const { captured } = run(
      useRequest,
      async () => {
        throw new Error("boom");
      },
      { error: { fatal: false } },
    );
    await flushPromises();
    const err = captured[0];
    if (!isAppError(err)) throw new Error("not an app error");
    expect(err.fatal).toBe(false);
  });
});
