import type { HTTPCode } from "ltrl-http";
import type { NuxtError } from "#app";

export type Severity = "fatal" | "error" | "warning" | "info";

// Module augmentation point — apps extend this interface to define
// their discriminated union of error data:
//
// declare module "@zoobz-io/foundation/types" {
//   interface ErrorDataMap {
//     validation: { kind: "validation"; field: string; rule: string };
//     network: { kind: "network"; url: string };
//   }
// }
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ErrorDataMap {}

export type ErrorData = [keyof ErrorDataMap] extends [never]
  ? Record<string, unknown>
  : ErrorDataMap[keyof ErrorDataMap];

export interface ErrorPayload {
  severity: Severity;
  detail?: ErrorData;
}

export interface AppErrorOptions {
  code: HTTPCode;
  message: string;
  data?: ErrorData;
}

export type AppError = NuxtError<ErrorPayload>;
