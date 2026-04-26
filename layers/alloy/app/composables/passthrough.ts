export const usePassthrough = <P, E = {}>(
  userPT: Passthrough<P, E> | undefined,
  localPT: Recipe<P, E>,
) => computed(() => passthrough(userPT, localPT));

export const useItemPassthrough = <T, P, E = {}>(
  items: T[],
  userPT: Passthrough<P, E> | undefined,
  localPT: (item: T) => Recipe<P, E>,
) =>
  computed(() =>
    items.map((item) => ({
      item,
      pt: passthrough(userPT, localPT(item)),
    })),
  );
