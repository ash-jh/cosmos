import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listRuns = query({
  args: {
    spacecraftId: v.optional(v.id("spacecraft")),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("simulationRuns");
    if (args.spacecraftId) {
      return await q
        .withIndex("by_spacecraft", (b) => b.eq("spacecraftId", args.spacecraftId!))
        .order("desc")
        .take(20);
    }
    return await q.order("desc").take(20);
  },
});

export const createRun = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    scenario: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("simulationRuns", {
      spacecraftId: args.spacecraftId,
      scenario: args.scenario,
      status: "running",
      startedAt: Date.now(),
    });
  },
});

export const updateRunResult = mutation({
  args: {
    id: v.id("simulationRuns"),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    result: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      endedAt: Date.now(),
      result: args.result,
    });
  },
});

export const injectFault = mutation({
  args: {
    simulationId: v.id("simulationRuns"),
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    subsystem: v.string(),
    faultType: v.string(),
    parameters: v.any(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("faultInjections", {
      simulationId: args.simulationId,
      spacecraftId: args.spacecraftId,
      timestamp: args.timestamp,
      subsystem: args.subsystem,
      faultType: args.faultType,
      parameters: args.parameters,
      duration: args.duration,
    });
  },
});

export const listFaults = query({
  args: {
    simulationId: v.optional(v.id("simulationRuns")),
  },
  handler: async (ctx, args) => {
    if (args.simulationId) {
      return await ctx.db
        .query("faultInjections")
        .withIndex("by_simulation", (q) => q.eq("simulationId", args.simulationId!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("faultInjections").order("desc").take(50);
  },
});

