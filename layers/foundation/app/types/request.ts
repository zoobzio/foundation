import type { AsyncDataOptions } from "#app";
import type { ErrorOptions } from "./error";
import type { HTTPCode } from "ltrl-http";

export type RequestOptions<ResT, DataT> = Omit<
  AsyncDataOptions<ResT, DataT>,
  "server"
> & {
  error?: {
    status?: HTTPCode;
    message?: string;
  } & ErrorOptions;
};
