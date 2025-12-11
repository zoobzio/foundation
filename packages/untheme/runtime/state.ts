import { useState } from "#app";

export type TokenRegistry = Record<string, Record<string, string>>;

export const useTokenRegistry = () => {
  return useState<TokenRegistry>("untheme-tokens", () => ({}));
};
