import type { RosettaConfig, RosettaProvider } from "./types";

export type { RosettaConfig, RosettaProvider };
export { mockProvider } from "./providers";

export const defineRosetta = (config: RosettaConfig): RosettaConfig => config;

export const defineRosettaProvider = (provider: RosettaProvider): RosettaProvider => provider;
