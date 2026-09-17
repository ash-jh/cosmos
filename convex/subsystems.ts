import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    name: v.string(),
    type: v.union(
      v.literal("EPS"),
      v.literal("ADCS"),
      v.literal("OBC"),
      v.literal("COMM"),
      v.literal("PAYLOAD"),
      v.literal("THERMAL")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const id = await ctx.db.insert("subsystems", {
      spacecraftId: args.spacecraftId,
      name: args.name,
      type: args.type,
      description: args.description,
      status: "offline",
    });

    return id;
  },
});

export const list = query({
  args: {
    spacecraftId: v.id("spacecraft"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subsystems")
      .withIndex("by_spacecraft", (q) => q.eq("spacecraftId", args.spacecraftId))
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("subsystems"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("subsystems"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const createDefaults = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const defaultSubsystems = [
      { name: "Electrical Power System", type: "EPS", description: "Standard CubeSat EPS subsystem" },
      { name: "Attitude Determination & Control", type: "ADCS", description: "Standard CubeSat ADCS subsystem" },
      { name: "On-Board Computer", type: "OBC", description: "Standard CubeSat OBC subsystem" },
      { name: "Communications", type: "COMM", description: "Standard CubeSat COMM subsystem" },
      { name: "Payload", type: "PAYLOAD", description: "Standard CubeSat PAYLOAD subsystem" },
      { name: "Thermal Control", type: "THERMAL", description: "Standard CubeSat THERMAL subsystem" },
    ];

    const ids = [];
    for (const sub of defaultSubsystems) {
      const id = await ctx.db.insert("subsystems", {
        spacecraftId: args.spacecraftId,
        name: sub.name,
        type: sub.type as any,
        description: sub.description,
        status: "offline",
      });
      ids.push(id);
    }
    
    return ids;
  },
});
