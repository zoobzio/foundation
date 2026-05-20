import type { AuthConfig, AuthHandlers } from "./types";

export type { AuthConfig, AuthHandlers };

export const defineAuth = (config: AuthConfig): AuthConfig => config;
