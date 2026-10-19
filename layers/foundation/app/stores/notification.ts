import type { Notification } from "../types/notification";

import { useState } from "#imports";

export const accessNotifications = () => {
  const notifications = useState<Notification[]>("app:notifications", () => []);
  return {
    notifications,
  };
};
