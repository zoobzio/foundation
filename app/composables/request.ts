import type { AppError } from "#foundation/types/error";
import type { RequestOptions } from "#foundation/types/request";
import type { MaybeRefOrGetter } from "vue";

import { useAsyncData, useLazyAsyncData, toValue, watch } from "#imports";
import { useLogger } from "#foundation/composables/log";
import { useError } from "#foundation/utils/errors";
import { status } from "ltrl-http";

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
      results.pending,
      (pending) => {
        if (!pending) {
          if (results.status.value === "error") {
            log.error("Request failed", {
              id,
              error: results.error.value,
            });
            throw useError(
              errOpts?.status ?? status.INTERNAL_SERVER_ERROR,
              errOpts?.message ?? "Request failed",
              {
                notification: errOpts?.notification ?? {
                  title: "An unknown error occured",
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
            status: results.status.value,
            results: results.data.value,
            error: results.error.value,
          });
        }
      },
      { immediate: true },
    );

    return results;
  };
};

export const useRequest = make(useAsyncData, true);

export const useLazyRequest = make(useLazyAsyncData, false);
