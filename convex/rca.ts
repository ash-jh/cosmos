import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("rcaResults").order("desc").take(50);
    if (args.status) {
      return all.filter((r) => r.status === args.status);
    }
    return all;
  },
});

export const getByAnomaly = query({
  args: {
    anomalyId: v.id("anomalyResults"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rcaResults")
      .withIndex("by_anomaly", (q) => q.eq("anomalyId", args.anomalyId))
      .first();
  },
});

export const recordRca = mutation({
  args: {
    anomalyId: v.id("anomalyResults"),
    candidateSubsystem: v.string(),
    candidateCause: v.string(),
    confidence: v.number(),
    evidence: v.array(
      v.object({
        channel: v.string(),
        observation: v.string(),
        score: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rcaResults", {
      anomalyId: args.anomalyId,
      candidateSubsystem: args.candidateSubsystem,
      candidateCause: args.candidateCause,
      confidence: args.confidence,
      evidence: args.evidence,
      status: "pending",
    });
  },
});

export const setDecision = mutation({
  args: {
    id: v.id("rcaResults"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

