import type { AsyncDataOptions } from "#app";
import type { ErrorOptions } from "./error";
import type { HTTPCode } from "ltrl-http";

/**
 * What `useRequest` and `useLazyRequest` take: Nuxt's async-data options,
 * less `server` (the wrapper sets it), plus how a failure is reported: the
 * status code and message of the error thrown, and its {@link ErrorOptions}.
 */
export type RequestOptions<ResT, DataT> = Omit<
  AsyncDataOptions<ResT, DataT>,
  "server"
> & {
  error?: {
    status?: HTTPCode;
    message?: string;
  } & ErrorOptions;
};
