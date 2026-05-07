import type { H3Event } from "h3";

/**
 * Auth schema interfaces. Consumers extend via module augmentation:
 *
 * declare module "@zoobz-io/rampart/types" {
 *   interface RampartUser {
 *     email: string;
 *     name: string;
 *     roles: RampartRole[];
 *     scopes: RampartScope[];
 *   }
 *   interface RampartRoles {
 *     admin: true;
 *     editor: true;
 *     viewer: true;
 *   }
 *   interface RampartScopes {
 *     "users:read": true;
 *     "users:write": true;
 *     "billing:manage": true;
 *   }
 * }
 */

export interface RampartUser {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RampartRoles {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RampartScopes {}

export type RampartRole = [keyof RampartRoles] extends [never]
  ? string
  : keyof RampartRoles;

export type RampartScope = [keyof RampartScopes] extends [never]
  ? string
  : keyof RampartScopes;

/** Token data managed by rampart. */
export interface RampartTokens {
  accessToken: string;
  expiresAt: number;
}

/** Stored in the sealed cookie session. */
export interface RampartIdentity {
  user: RampartUser;
  tokens?: RampartTokens;
}

/** Session helpers passed to the login callback. */
export interface RampartSessionHelpers {
  setSession: (identity: RampartIdentity) => Promise<void>;
}

/** The minimum the consumer provides. */
export interface RampartHandlers {
  /** Enrich or transform the stored identity. Called with the session data on every protected request. */
  me: (event: H3Event, session: RampartIdentity) => RampartIdentity | null | Promise<RampartIdentity | null>;
  /** Start the login flow (e.g. redirect to OAuth provider). */
  login: (event: H3Event) => void | Promise<void>;
  /** Handle the OAuth callback. Authenticate, then call setSession to persist. */
  callback: (event: H3Event, helpers: RampartSessionHelpers) => void | Promise<void>;
  /** Provider-specific cleanup (revoke tokens, etc.). Rampart clears the session automatically. */
  logout: (event: H3Event) => void | Promise<void>;
  /** Optional: refresh the access token. Return fresh tokens or null to force re-login. */
  refresh?: (event: H3Event) => RampartTokens | null | Promise<RampartTokens | null>;
}

/** Config for the rampart module. */
export interface RampartConfig {
  /** Base path for auth routes (e.g. "/auth"). */
  basePath: string;
  /** Routes that don't require authentication. */
  publicRoutes?: string[];
  /** Milliseconds before token expiry to trigger a refresh. Default: 10 minutes. */
  refreshThreshold?: number;
  /** Route to redirect to when an authenticated user lacks permissions. Default: throws 403. */
  forbiddenRoute?: string;
  /** Milliseconds to cache the me() result in the session. 0 disables caching. Default: 5 minutes. */
  meCacheTTL?: number;
}
