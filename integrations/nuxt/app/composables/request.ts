import type { AppError } from "../types/error";
import type { RequestOptions } from "../types/request";
import type { MaybeRefOrGetter } from "vue";

import { toValue, useAsyncData, useLazyAsyncData, watch } from "#imports";
import { status } from "ltrl-http";
import { useLogger } from "./log";
import { useAppError } from "./error";

/**
 * Builds a request composable over one of Nuxt's async-data composables.
 * `blocking` sets `server`: a blocking request runs during SSR and a
 * failure there is fatal by default; a lazy one runs on the client only
 * and a failure toasts by default.
 */
const make = (
  fn: typeof useAsyncData | typeof useLazyAsyncData,
  blocking: boolean,
) => {
  return <ResT, DataT = ResT>(
    key: MaybeRefOrGetter<string>,
    handler: () => Promise<ResT>,
    opts: RequestOptions<ResT, DataT> = {},
  ) => {
    const id = crypto.randomUUID();
    const log = useLogger(toValue(key));

    log.debug("Request started", {
      id,
      start: new Date().toISOString(),
    });

    const { error: errOpts, ...asyncOpts } = opts;

    const results = fn<ResT, AppError, DataT>(key, handler, {
      ...asyncOpts,
      server: blocking,
    });

    watch(
      results.status,
      (current) => {
        if (current === "idle" || current === "pending") return;
        if (current === "error") {
          log.error("Request failed", {
            id,
            error: results.error.value,
          });
          throw useAppError(
            errOpts?.status ?? status.INTERNAL_SERVER_ERROR,
            errOpts?.message ?? "Request failed",
            {
              notification: errOpts?.notification ?? {
                title: "An unknown error occurred",
                variant: "error",
                description: results.error.value?.message,
              },
              cause: errOpts?.cause ?? results.error.value,
              fatal: errOpts?.fatal ?? blocking,
            },
          );
        }
        log.debug("Request finished", {
          id,
          end: new Date().toISOString(),
          status: current,
          results: results.data.value,
        });
      },
      { immediate: true },
    );

    return results;
  };
};

/**
 * A request that blocks navigation: `useAsyncData` with `server: true`.
 * A failure throws a fatal app error by default.
 */
export const useRequest = make(useAsyncData, true);

/**
 * A request that does not block navigation: `useLazyAsyncData` with
 * `server: false`, so it runs on the client. A failure throws a non-fatal
 * app error by default, which the shell toasts.
 */
export const useLazyRequest = make(useLazyAsyncData, false);
