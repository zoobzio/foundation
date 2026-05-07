import type { RampartConfig, RampartHandlers } from "./types";

export type { RampartConfig, RampartHandlers };

export const defineRampart = (config: RampartConfig): RampartConfig => config;
