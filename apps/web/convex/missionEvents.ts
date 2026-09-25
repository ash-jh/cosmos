import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listBySpacecraft = query({
  args: {
    spacecraftId: v.id("spacecraft"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("missionEvents")
      .withIndex(
        "by_spacecraft",
        (q) => q.eq("spacecraftId", args.spacecraftId)
      )
      .order("desc")
      .collect();
  },
});

export const listByMission = query({
  args: {
    missionId: v.id("missions"),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("missionEvents")
      .withIndex(
        "by_mission",
        (q) => q.eq("missionId", args.missionId)
      )
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    missionId: v.id("missions"),
    spacecraftId: v.id("spacecraft"),

    timestamp: v.number(),

    eventType: v.string(),
    severity: v.string(),

    title: v.string(),
    message: v.string(),

    source: v.string(),

    anomalyId: v.optional(v.id("anomalyResults")),
    simulationId: v.optional(v.id("simulationRuns")),

    subsystem: v.optional(v.string()),

    metadata: v.optional(v.any()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("missionEvents", args);
  },
});