import type { PageCollections } from "@nuxt/content";

export interface SurroundItem {
  path: string;
  title: string;
  description?: string;
}

export interface SurroundOrder<T extends keyof PageCollections> {
  field: keyof PageCollections[T];
  direction: "ASC" | "DESC";
}

export const useContentSurround = <T extends keyof PageCollections>(
  collection: T,
  path?: MaybeRef<string>,
  order?: SurroundOrder<T>,
) => {
  const route = useRoute();
  const pathRef = computed(() => toValue(path) ?? route.path);

  const { data, pending, error } = useAsyncData(
    `surround-${pathRef.value}`,
    () => {
      const query = queryCollectionItemSurroundings(collection, pathRef.value, {
        fields: ["description"],
      });
      if (order) {
        return query.order(order.field, order.direction);
      }
      return query;
    },
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
