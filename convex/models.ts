import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("models").collect();
  },
});

export const registerModel = mutation({
  args: {
    name: v.string(),
    version: v.string(),
    architecture: v.union(
      v.literal("lstm"),
      v.literal("tcn"),
      v.literal("statistical")
    ),
    dataset: v.optional(v.string()),
    metrics: v.optional(
      v.object({
        f1: v.optional(v.number()),
        precision: v.optional(v.number()),
        recall: v.optional(v.number()),
        falsePositiveRate: v.optional(v.number()),
      })
    ),
    size: v.optional(v.number()),
    latency: v.optional(v.number()),
    ramUsage: v.optional(v.number()),
    status: v.union(
      v.literal("training"),
      v.literal("ready"),
      v.literal("deployed"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("models", args);
  },
});

export const updateMetrics = mutation({
  args: {
    id: v.id("models"),
    metrics: v.object({
      f1: v.optional(v.number()),
      precision: v.optional(v.number()),
      recall: v.optional(v.number()),
      falsePositiveRate: v.optional(v.number()),
    }),
    size: v.optional(v.number()),
    latency: v.optional(v.number()),
    ramUsage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

