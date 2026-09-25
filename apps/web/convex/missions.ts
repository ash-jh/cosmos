import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },

  returns: v.array(
    v.object({
      _id: v.id("missions"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
      name: v.string(),
      missionType: v.string(),
      status: v.string(),
      description: v.string(),
      createdAt: v.number(),
    })
  ),

  handler: async (ctx, args) => {
    return await ctx.db
      .query("missions")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    missionType: v.string(),
    description: v.string(),
  },

  returns: v.id("missions"),

  handler: async (ctx, args) => {
    return await ctx.db.insert("missions", {
      organizationId: args.organizationId,
      name: args.name,
      missionType: args.missionType,
      status: "active",
      description: args.description,
      createdAt: Date.now(),
    });
  },
});