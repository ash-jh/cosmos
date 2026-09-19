import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    missionType: v.union(
      v.literal("cubesat"),
      v.literal("smallsat"),
      v.literal("cansat"),
      v.literal("other")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      // allow seeding or demo creation if auth is in demo mode
    }

    const missionId = await ctx.db.insert("missions", {
      organizationId: args.organizationId,
      name: args.name,
      missionType: args.missionType,
      description: args.description,
      status: "planning",
      createdAt: Date.now(),
    });

    return missionId;
  },
});

export const list = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("missions")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("missions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("missions"),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      // allow updates
    }

    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});
