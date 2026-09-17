import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    subsystemId: v.id("subsystems"),
    name: v.string(),
    unit: v.string(),
    datatype: v.union(
      v.literal("float"),
      v.literal("integer"),
      v.literal("boolean"),
      v.literal("string")
    ),
    samplingRate: v.number(),
    minValue: v.optional(v.number()),
    maxValue: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const id = await ctx.db.insert("telemetryChannels", {
      spacecraftId: args.spacecraftId,
      subsystemId: args.subsystemId,
      name: args.name,
      unit: args.unit,
      datatype: args.datatype,
      samplingRate: args.samplingRate,
      minValue: args.minValue,
      maxValue: args.maxValue,
      description: args.description,
    });

    return id;
  },
});

export const list = query({
  args: {
    spacecraftId: v.id("spacecraft"),
    subsystemId: v.optional(v.id("subsystems")),
  },
  handler: async (ctx, args) => {
    if (args.subsystemId) {
      return await ctx.db
        .query("telemetryChannels")
        .withIndex("by_subsystem", (q) => q.eq("subsystemId", args.subsystemId as any))
        .collect();
    } else {
      return await ctx.db
        .query("telemetryChannels")
        .withIndex("by_spacecraft", (q) => q.eq("spacecraftId", args.spacecraftId))
        .collect();
    }
  },
});

export const getById = query({
  args: {
    id: v.id("telemetryChannels"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("telemetryChannels"),
    name: v.optional(v.string()),
    unit: v.optional(v.string()),
    datatype: v.optional(
      v.union(
        v.literal("float"),
        v.literal("integer"),
        v.literal("boolean"),
        v.literal("string")
      )
    ),
    samplingRate: v.optional(v.number()),
    minValue: v.optional(v.number()),
    maxValue: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: {
    id: v.id("telemetryChannels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(args.id);
  },
});

export const createDefaults = mutation({
  args: {
    spacecraftId: v.id("spacecraft"),
    subsystemId: v.id("subsystems"),
    subsystemType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    type ChannelDef = {
      name: string;
      unit: string;
      datatype: "float" | "integer" | "boolean" | "string";
      samplingRate: number;
      minValue?: number;
      maxValue?: number;
    };

    const defaults: Record<string, ChannelDef[]> = {
      EPS: [
        { name: "battery_voltage", unit: "V", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 8.4 },
        { name: "battery_current", unit: "A", datatype: "float", samplingRate: 1, minValue: -3, maxValue: 5 },
        { name: "battery_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -20, maxValue: 60 },
        { name: "bus_voltage", unit: "V", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 8.4 },
        { name: "state_of_charge", unit: "%", datatype: "float", samplingRate: 0.2, minValue: 0, maxValue: 100 },
      ],
      THERMAL: [
        { name: "battery_temp", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -20, maxValue: 60 },
        { name: "obc_temp", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -10, maxValue: 85 },
        { name: "payload_temp", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -20, maxValue: 50 },
      ],
      OBC: [
        { name: "cpu_utilization", unit: "%", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 100 },
        { name: "cpu_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -10, maxValue: 85 },
        { name: "memory_utilization", unit: "%", datatype: "float", samplingRate: 0.2, minValue: 0, maxValue: 100 },
        { name: "reboot_count", unit: "count", datatype: "integer", samplingRate: 0.1, minValue: 0, maxValue: 1000 },
      ],
      ADCS: [
        { name: "angular_velocity_x", unit: "°/s", datatype: "float", samplingRate: 2, minValue: -360, maxValue: 360 },
        { name: "angular_velocity_y", unit: "°/s", datatype: "float", samplingRate: 2, minValue: -360, maxValue: 360 },
        { name: "angular_velocity_z", unit: "°/s", datatype: "float", samplingRate: 2, minValue: -360, maxValue: 360 },
        { name: "attitude_error", unit: "°", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 180 },
        { name: "reaction_wheel_speed", unit: "RPM", datatype: "float", samplingRate: 1, minValue: -8000, maxValue: 8000 },
      ],
      COMM: [
        { name: "rssi", unit: "dBm", datatype: "float", samplingRate: 0.5, minValue: -120, maxValue: 0 },
        { name: "packet_loss", unit: "%", datatype: "float", samplingRate: 0.2, minValue: 0, maxValue: 100 },
        { name: "signal_strength", unit: "dBm", datatype: "float", samplingRate: 0.5, minValue: -120, maxValue: 0 },
        { name: "uplink_count", unit: "count", datatype: "integer", samplingRate: 0.1 },
        { name: "downlink_count", unit: "count", datatype: "integer", samplingRate: 0.1 },
      ],
      PAYLOAD: [],
    };

    const channelsToCreate = defaults[args.subsystemType] || [];
    const ids = [];

    for (const ch of channelsToCreate) {
      const id = await ctx.db.insert("telemetryChannels", {
        spacecraftId: args.spacecraftId,
        subsystemId: args.subsystemId,
        name: ch.name,
        unit: ch.unit,
        datatype: ch.datatype,
        samplingRate: ch.samplingRate,
        minValue: ch.minValue,
        maxValue: ch.maxValue,
      });
      ids.push(id);
    }

    return ids;
  },
});
