import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const ingestBatch = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    records: v.array(
      v.object({
        channelName: v.string(),
        timestamp: v.number(),
        value: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Look up channels for this spacecraft
    const channels = await ctx.db
      .query("telemetryChannels")
      .withIndex("by_spacecraft", (q) => q.eq("spacecraftId", args.spacecraftId))
      .collect();

    const channelMap = new Map<string, typeof channels[0]>();
    for (const ch of channels) {
      channelMap.set(ch.name, ch);
    }

    const insertedIds = [];
    for (const rec of args.records) {
      const ch = channelMap.get(rec.channelName);
      if (ch) {
        const id = await ctx.db.insert("telemetryData", {
          spacecraftId: args.spacecraftId,
          channelId: ch._id,
          timestamp: rec.timestamp,
          value: rec.value,
        });
        insertedIds.push(id);
      }
    }
    return insertedIds.length;
  },
});

export const getLatestBySpacecraft = query({
  args: {
    spacecraftId: v.id("spacecraft"),
  },
  handler: async (ctx, args) => {
    const channels = await ctx.db
      .query("telemetryChannels")
      .withIndex("by_spacecraft", (q) => q.eq("spacecraftId", args.spacecraftId))
      .collect();

    const results = [];
    for (const ch of channels) {
      const latestData = await ctx.db
        .query("telemetryData")
        .withIndex("by_spacecraft_and_timestamp", (q) => q.eq("spacecraftId", args.spacecraftId))
        .order("desc")
        .filter((q) => q.eq(q.field("channelId"), ch._id))
        .first();

      results.push({
        channel: ch,
        latest: latestData ? { timestamp: latestData.timestamp, value: latestData.value } : null,
      });
    }

    return results;
  },
});

export const getTimeSeries = query({
  args: {
    spacecraftId: v.id("spacecraft"),
    channelName: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const channel = await ctx.db
      .query("telemetryChannels")
      .withIndex("by_spacecraft", (q) => q.eq("spacecraftId", args.spacecraftId))
      .filter((q) => q.eq(q.field("name"), args.channelName))
      .first();

    if (!channel) return [];

    const data = await ctx.db
      .query("telemetryData")
      .withIndex("by_spacecraft_and_timestamp", (q) => q.eq("spacecraftId", args.spacecraftId))
      .filter((q) => q.eq(q.field("channelId"), channel._id))
      .order("desc")
      .take(args.limit ?? 60);

    return data.reverse();
  },
});

