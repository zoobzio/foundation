import type { Notification } from "../types/notification";

import { accessNotifications } from "../stores/notification";

export const useNotifications = () => {
  const { notifications } = accessNotifications();

  const push = (notification: Omit<Notification, "id">) => {
    notifications.value.push({ ...notification, id: crypto.randomUUID() });
  };

  const capture = (_err: unknown) => {};

  const remove = (id: Notification["id"]) => {
    notifications.value = notifications.value.filter((t) => t.id !== id);
  };

  return { notifications, push, capture, remove };
};
