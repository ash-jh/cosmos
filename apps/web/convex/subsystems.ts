import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    spacecraftId: v.id("spacecraft"),
  },

  returns: v.array(
    v.object({
      _id: v.id("subsystems"),
      _creationTime: v.number(),
      spacecraftId: v.id("spacecraft"),
      name: v.string(),
      type: v.string(),
      status: v.string(),
      description: v.string(),
    })
  ),

  handler: async (ctx, args) => {
    return await ctx.db
      .query("subsystems")
      .withIndex("by_spacecraft", (q) =>
        q.eq("spacecraftId", args.spacecraftId)
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    name: v.string(),
    type: v.string(),
    description: v.string(),
  },

  returns: v.id("subsystems"),

  handler: async (ctx, args) => {
    return await ctx.db.insert("subsystems", {
      spacecraftId: args.spacecraftId,
      name: args.name,
      type: args.type,
      status: "nominal",
      description: args.description,
    });
  },
});