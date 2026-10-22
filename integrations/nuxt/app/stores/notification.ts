import type { Notification } from "../types/notification";

import { useState } from "#imports";

/**
 * The Nuxt backing for the app's notifications: one `useState` record,
 * keyed `app:notifications`, shared by every caller and carried across SSR
 * hydration.
 */
export const accessNotifications = () => {
  const notifications = useState<Notification[]>("app:notifications", () => []);
  return { notifications };
};
