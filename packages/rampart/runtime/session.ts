import { useSession } from "h3";
import type { H3Event } from "h3";
import type { RampartIdentity } from "../src/types";

interface SessionData extends RampartIdentity {
  cachedAt?: number;
}

const SESSION_NAME = "rampart";

const getPassword = (): string => {
  const password = process.env.NUXT_RAMPART_SECRET || process.env.NUXT_SESSION_PASSWORD;
  if (!password) throw new Error("[rampart] Missing session secret. Set NUXT_RAMPART_SECRET or NUXT_SESSION_PASSWORD env var.");
  return password;
};

const getSessionConfig = () => ({
  password: getPassword(),
  name: SESSION_NAME,
  maxAge: 60 * 60 * 24 * 7, // 7 days
});

/** Read the current session from the sealed cookie. */
export const getSession = async (event: H3Event): Promise<SessionData | null> => {
  const session = await useSession<SessionData>(event, getSessionConfig());
  if (!session.data.user) return null;
  return session.data;
};

/** Write an identity to the sealed cookie session, with cache timestamp. */
export const setSession = async (event: H3Event, identity: RampartIdentity): Promise<void> => {
  const session = await useSession<SessionData>(event, getSessionConfig());
  await session.update({ ...identity, cachedAt: Date.now() });
};

/** Clear the sealed cookie session. */
export const clearSession = async (event: H3Event): Promise<void> => {
  const session = await useSession<SessionData>(event, getSessionConfig());
  await session.clear();
};

/** Check if the cached identity is still fresh. */
export const isCacheFresh = (session: SessionData, ttl: number): boolean => {
  if (ttl === 0) return false;
  if (!session.cachedAt) return false;
  return Date.now() - session.cachedAt < ttl;
};
