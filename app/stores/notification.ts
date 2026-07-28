import type { Notification } from "#foundation/types/notification";

import { useState } from "#imports";

export const accessNotifications = () => {
  const notifications = useState<Notification[]>("app:notifications", () => []);
  return {
    notifications,
  };
};
