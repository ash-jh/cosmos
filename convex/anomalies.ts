import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    spacecraftId: v.optional(v.id("spacecraft")),
    status: v.optional(
      v.union(
        v.literal("detected"),
        v.literal("investigating"),
        v.literal("resolved"),
        v.literal("false_positive")
      )
    ),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("anomalyResults");
    if (args.spacecraftId) {
      const results = await q
        .withIndex("by_spacecraft", (b) => b.eq("spacecraftId", args.spacecraftId!))
        .order("desc")
        .take(100);
      if (args.status) {
        return results.filter((a) => a.status === args.status);
      }
      return results;
    }
    const all = await q.order("desc").take(100);
    if (args.status) {
      return all.filter((a) => a.status === args.status);
    }
    return all;
  },
});

export const getById = query({
  args: {
    id: v.id("anomalyResults"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const recordAnomaly = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    modelId: v.optional(v.id("models")),
    score: v.number(),
    threshold: v.number(),
    severity: v.string(),
    affectedChannels: v.array(v.id("telemetryChannels")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("anomalyResults", {
      spacecraftId: args.spacecraftId,
      timestamp: args.timestamp,
      modelId: args.modelId,
      score: args.score,
      threshold: args.threshold,
      severity: args.severity,
      affectedChannels: args.affectedChannels,
      status: "detected",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("anomalyResults"),
    status: v.union(
      v.literal("detected"),
      v.literal("investigating"),
      v.literal("resolved"),
      v.literal("false_positive")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

