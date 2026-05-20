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

export interface AuthUser {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthRoles {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthScopes {}

export type AuthRole = [keyof AuthRoles] extends [never]
  ? string
  : keyof AuthRoles;

export type AuthScope = [keyof AuthScopes] extends [never]
  ? string
  : keyof AuthScopes;

/** Token data managed by rampart. */
export interface AuthTokens {
  accessToken: string;
  expiresAt: number;
}

/** Stored in the sealed cookie session. */
export interface AuthIdentity {
  user: AuthUser;
  tokens?: AuthTokens;
}

/** Session helpers passed to the login callback. */
export interface AuthSessionHelpers {
  setSession: (identity: AuthIdentity) => Promise<void>;
}

/** The minimum the consumer provides. */
export interface AuthHandlers {
  /** Enrich or transform the stored identity. Called with the session data on every protected request. */
  me: (event: H3Event, session: AuthIdentity) => AuthIdentity | null | Promise<AuthIdentity | null>;
  /** Start the login flow (e.g. redirect to OAuth provider). */
  login: (event: H3Event) => void | Promise<void>;
  /** Handle the OAuth callback. Authenticate, then call setSession to persist. */
  callback: (event: H3Event, helpers: AuthSessionHelpers) => void | Promise<void>;
  /** Provider-specific cleanup (revoke tokens, etc.). Rampart clears the session automatically. */
  logout: (event: H3Event) => void | Promise<void>;
  /** Optional: refresh the access token. Return fresh tokens or null to force re-login. */
  refresh?: (event: H3Event) => AuthTokens | null | Promise<AuthTokens | null>;
}

/** Config for the rampart module. */
export interface AuthConfig {
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
  /** Route to redirect to after logout. Default: loginPath. */
  logoutRedirect?: string;
}
