import type { PageCollections } from "@nuxt/content";

export interface SurroundItem {
  path: string;
  title: string;
  description?: string;
}

export const useContentSurround = <T extends keyof PageCollections>(
  collection: T,
  path?: MaybeRef<string>,
) => {
  const route = useRoute();
  const pathRef = computed(() => toValue(path) ?? route.path);

  const { data, pending, error } = useAsyncData(
    `surround-${pathRef.value}`,
    () =>
      queryCollectionItemSurroundings(collection, pathRef.value, {
        fields: ["description"],
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
