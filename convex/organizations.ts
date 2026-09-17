import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const slug = args.name.toLowerCase().replace(/\s+/g, "-");

    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: slug,
    });

    await ctx.db.insert("organizationMembers", {
      organizationId: orgId,
      userId: userId,
      role: "admin",
    });

    return orgId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    const memberships = await ctx.db
      .query("organizationMembers")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const orgs = await Promise.all(
      memberships.map(async (m) => {
        return await ctx.db.get(m.organizationId);
      })
    );

    return orgs.filter((org) => org !== null);
  },
});

export const getById = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});
