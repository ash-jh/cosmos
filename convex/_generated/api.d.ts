/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alerts from "../alerts.js";
import type * as anomalies from "../anomalies.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as missions from "../missions.js";
import type * as models from "../models.js";
import type * as organizations from "../organizations.js";
import type * as rca from "../rca.js";
import type * as seed from "../seed.js";
import type * as simulations from "../simulations.js";
import type * as spacecraft from "../spacecraft.js";
import type * as subsystems from "../subsystems.js";
import type * as telemetry from "../telemetry.js";
import type * as telemetryChannels from "../telemetryChannels.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  anomalies: typeof anomalies;
  auth: typeof auth;
  http: typeof http;
  missions: typeof missions;
  models: typeof models;
  organizations: typeof organizations;
  rca: typeof rca;
  seed: typeof seed;
  simulations: typeof simulations;
  spacecraft: typeof spacecraft;
  subsystems: typeof subsystems;
  telemetry: typeof telemetry;
  telemetryChannels: typeof telemetryChannels;
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

