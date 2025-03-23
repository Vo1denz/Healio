/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as forum from "../forum.js";
import type * as goals from "../goals.js";
import type * as http from "../http.js";
import type * as journals from "../journals.js";
import type * as moodEntries from "../moodEntries.js";
import type * as rooms from "../rooms.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  forum: typeof forum;
  goals: typeof goals;
  http: typeof http;
  journals: typeof journals;
  moodEntries: typeof moodEntries;
  rooms: typeof rooms;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
