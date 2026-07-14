import { readonly, ref } from "#imports";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: "info" | "success" | "warning" | "error";
}

const items = ref<ToastItem[]>([]);
let nextId = 0;

export const useToasts = () => {
  const push = (toast: Omit<ToastItem, "id">) => {
    items.value.push({ ...toast, id: nextId++ });
  };

  const remove = (id: number) => {
    items.value = items.value.filter((t) => t.id !== id);
  };

  return { items: readonly(items), push, remove };
};
