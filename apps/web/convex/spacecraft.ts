import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByMission = query({
  args: {
    missionId: v.id("missions"),
  },

  returns: v.array(
    v.object({
      _id: v.id("spacecraft"),
      _creationTime: v.number(),
      missionId: v.id("missions"),
      name: v.string(),
      status: v.string(),
      noradId: v.optional(v.string()),
      orbitConfig: v.optional(v.any()),
      createdAt: v.number(),
    })
  ),

  handler: async (ctx, args) => {
    return await ctx.db
      .query("spacecraft")
      .withIndex("by_mission", (q) =>
        q.eq("missionId", args.missionId)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    missionId: v.id("missions"),
    name: v.string(),
  },

  returns: v.id("spacecraft"),

  handler: async (ctx, args) => {
    return await ctx.db.insert("spacecraft", {
      missionId: args.missionId,
      name: args.name,
      status: "nominal",
      createdAt: Date.now(),
    });
  },
});