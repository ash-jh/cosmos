import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    spacecraftId: v.optional(v.id("spacecraft")),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("acknowledged"),
        v.literal("resolved")
      )
    ),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("alerts");
    if (args.spacecraftId) {
      const results = await q
        .withIndex("by_spacecraft", (b) => b.eq("spacecraftId", args.spacecraftId!))
        .order("desc")
        .collect();
      if (args.status) {
        return results.filter((a) => a.status === args.status);
      }
      return results;
    }
    const all = await q.order("desc").take(50);
    if (args.status) {
      return all.filter((a) => a.status === args.status);
    }
    return all;
  },
});

export const create = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("critical")
    ),
    type: v.string(),
    message: v.string(),
    relatedChannels: v.array(v.id("telemetryChannels")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      spacecraftId: args.spacecraftId,
      timestamp: args.timestamp,
      severity: args.severity,
      type: args.type,
      status: "active",
      message: args.message,
      relatedChannels: args.relatedChannels,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("alerts"),
    status: v.union(
      v.literal("active"),
      v.literal("acknowledged"),
      v.literal("resolved")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

