/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as badges from "../badges.js";
import type * as cleanup from "../cleanup.js";
import type * as discord_auth from "../discord/auth.js";
import type * as discord_commands from "../discord/commands.js";
import type * as discord_guild from "../discord/guild.js";
import type * as discord_interactions from "../discord/interactions.js";
import type * as discord_utils from "../discord/utils.js";
import type * as http from "../http.js";
import type * as links from "../links.js";
import type * as migrations from "../migrations.js";
import type * as seedData from "../seedData.js";
import type * as status from "../status.js";
import type * as testing from "../testing.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  badges: typeof badges;
  cleanup: typeof cleanup;
  "discord/auth": typeof discord_auth;
  "discord/commands": typeof discord_commands;
  "discord/guild": typeof discord_guild;
  "discord/interactions": typeof discord_interactions;
  "discord/utils": typeof discord_utils;
  http: typeof http;
  links: typeof links;
  migrations: typeof migrations;
  seedData: typeof seedData;
  status: typeof status;
  testing: typeof testing;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
