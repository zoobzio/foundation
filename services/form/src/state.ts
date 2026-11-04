import type { Config, State } from "./types";

/**
 * Builds the initial state container from config defaults. The result is a
 * plain object. Wrap it in a reactive proxy to track reads and writes. The
 * payload starts as a copy of `config.defaults`.
 */
export const createFormState = <T>(config: Config<T>): State<T> => ({
  initialized: false,
  payload: { ...config.defaults },
  errors: {},
  touched: new Set(),
  submitting: false,
  submitted: false,
});
