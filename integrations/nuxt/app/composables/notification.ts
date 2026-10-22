import type { Notification } from "../types/notification";

import { accessNotifications } from "../stores/notification";

/**
 * The app's notification queue: the shared list the shell renders as
 * toasts, with `push` to add one (the id is assigned here) and `remove` to
 * dismiss one by id.
 */
export const useNotifications = () => {
  const { notifications } = accessNotifications();

  const push = (notification: Omit<Notification, "id">): Notification => {
    const entry = { ...notification, id: crypto.randomUUID() };
    notifications.value = [...notifications.value, entry];
    return entry;
  };

  const remove = (id: Notification["id"]) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  return { notifications, push, remove };
};
