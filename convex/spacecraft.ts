import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    missionId: v.id("missions"),
    name: v.string(),
    noradId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const id = await ctx.db.insert("spacecraft", {
      missionId: args.missionId,
      name: args.name,
      noradId: args.noradId,
      status: "offline",
      createdAt: Date.now(),
    });
    
    return id;
  },
});

export const list = query({
  args: {
    missionId: v.id("missions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("spacecraft")
      .withIndex("by_mission", (q) => q.eq("missionId", args.missionId))
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("spacecraft"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("spacecraft"),
    status: v.union(
      v.literal("nominal"),
      v.literal("warning"),
      v.literal("critical"),
      v.literal("offline")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    await ctx.db.patch(args.id, { status: args.status });
  },
});
