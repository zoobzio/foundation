export interface SurroundItem {
  path: string;
  title: string;
  description?: string;
}

export interface UseContentSurroundOptions {
  fields?: string[];
}

export const useContentSurround = (
  collection: string,
  path?: MaybeRef<string>,
  options?: UseContentSurroundOptions,
) => {
  const route = useRoute();
  const pathRef = computed(() => toValue(path) ?? route.path);

  const { data, pending, error } = useAsyncData(
    `surround-${pathRef.value}`,
    () =>
      queryCollectionItemSurroundings(collection as any, pathRef.value, {
        fields: options?.fields ?? ["description"],
      }),
    { watch: [pathRef] },
  );

  const prev = computed<SurroundItem | null>(() => data.value?.[0] ?? null);
  const next = computed<SurroundItem | null>(() => data.value?.[1] ?? null);

  return {
    prev,
    next,
    pending,
    error,
  };
};
