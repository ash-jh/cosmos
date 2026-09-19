import { mutation } from "./_generated/server";

export const seedReferenceMission = mutation({
  handler: async (ctx) => {
    // Check if RVCE organization already exists
    let org = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "rvce"))
      .first();

    if (!org) {
      const orgId = await ctx.db.insert("organizations", {
        name: "RVCE",
        slug: "rvce",
        createdAt: Date.now(),
      });
      org = await ctx.db.get(orgId);
    }

    if (!org) throw new Error("Failed to create organization");

    // Check or create Mission: RVCE CubeSat-01
    let mission = await ctx.db
      .query("missions")
      .withIndex("by_organization", (q) => q.eq("organizationId", org._id))
      .filter((q) => q.eq(q.field("name"), "RVCE CubeSat-01"))
      .first();

    if (!mission) {
      const missionId = await ctx.db.insert("missions", {
        organizationId: org._id,
        name: "RVCE CubeSat-01",
        missionType: "cubesat",
        status: "active",
        description: "Student CubeSat mission for low-Earth orbit research and real-time health monitoring.",
        createdAt: Date.now(),
      });
      mission = await ctx.db.get(missionId);
    }

    if (!mission) throw new Error("Failed to create mission");

    // Check or create Spacecraft: COSMOS-SAT-01
    let spacecraft = await ctx.db
      .query("spacecraft")
      .withIndex("by_mission", (q) => q.eq("missionId", mission._id))
      .filter((q) => q.eq(q.field("name"), "COSMOS-SAT-01"))
      .first();

    if (!spacecraft) {
      const satId = await ctx.db.insert("spacecraft", {
        missionId: mission._id,
        name: "COSMOS-SAT-01",
        noradId: "99824",
        status: "nominal",
        orbitConfig: {
          altitude_km: 525,
          inclination_deg: 97.4,
          period_min: 94.8,
        },
        createdAt: Date.now(),
      });
      spacecraft = await ctx.db.get(satId);
    }

    if (!spacecraft) throw new Error("Failed to create spacecraft");

    // Define 6 Subsystems
    const subsystemDefs: Array<{
      name: string;
      type: "EPS" | "ADCS" | "OBC" | "COMM" | "PAYLOAD" | "THERMAL";
      description: string;
    }> = [
      { name: "Electrical Power System", type: "EPS", description: "Solar arrays, 2S Li-ion battery pack, and power distribution bus." },
      { name: "Thermal Control System", type: "THERMAL", description: "Passive radiators, thermal straps, and temperature sensor arrays." },
      { name: "On-Board Computer", type: "OBC", description: "ARM Cortex flight computer handling telemetry and command execution." },
      { name: "Attitude Determination & Control", type: "ADCS", description: "Magnetorquers, 3-axis reaction wheels, and Sun sensors." },
      { name: "Communications", type: "COMM", description: "UHF transceiver and deployable dipole antenna (437.425 MHz)." },
      { name: "Mission Payload", type: "PAYLOAD", description: "Radiation dosimeter and multispectral imaging sensor." },
    ];

    const subsystemMap = new Map<string, any>();
    for (const def of subsystemDefs) {
      let sub = await ctx.db
        .query("subsystems")
        .withIndex("by_spacecraft", (q) => q.eq("spacecraftId", spacecraft._id))
        .filter((q) => q.eq(q.field("type"), def.type))
        .first();

      if (!sub) {
        const subId = await ctx.db.insert("subsystems", {
          spacecraftId: spacecraft._id,
          name: def.name,
          type: def.type,
          status: "nominal",
          description: def.description,
        });
        sub = await ctx.db.get(subId);
      }
      subsystemMap.set(def.type, sub);
    }

    // Channels definitions
    type ChannelSpec = {
      name: string;
      unit: string;
      datatype: "float" | "integer" | "boolean" | "string";
      samplingRate: number;
      minValue: number;
      maxValue: number;
      nominalValue: number;
    };

    const channelSpecs: Record<string, ChannelSpec[]> = {
      EPS: [
        { name: "battery_voltage", unit: "V", datatype: "float", samplingRate: 1, minValue: 6.8, maxValue: 8.4, nominalValue: 7.82 },
        { name: "battery_current", unit: "A", datatype: "float", samplingRate: 1, minValue: -2.5, maxValue: 3.5, nominalValue: 1.45 },
        { name: "battery_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -10, maxValue: 45, nominalValue: 24.5 },
        { name: "bus_voltage", unit: "V", datatype: "float", samplingRate: 1, minValue: 4.8, maxValue: 8.4, nominalValue: 7.74 },
        { name: "state_of_charge", unit: "%", datatype: "float", samplingRate: 0.2, minValue: 20, maxValue: 100, nominalValue: 91.2 },
      ],
      THERMAL: [
        { name: "battery_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -10, maxValue: 45, nominalValue: 24.5 },
        { name: "obc_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -15, maxValue: 70, nominalValue: 34.2 },
        { name: "payload_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -20, maxValue: 55, nominalValue: 21.0 },
      ],
      OBC: [
        { name: "cpu_utilization", unit: "%", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 100, nominalValue: 28.5 },
        { name: "cpu_temperature", unit: "°C", datatype: "float", samplingRate: 0.5, minValue: -10, maxValue: 85, nominalValue: 38.6 },
        { name: "memory_utilization", unit: "%", datatype: "float", samplingRate: 0.2, minValue: 0, maxValue: 100, nominalValue: 42.1 },
        { name: "reboot_count", unit: "count", datatype: "integer", samplingRate: 0.1, minValue: 0, maxValue: 50, nominalValue: 1 },
      ],
      ADCS: [
        { name: "angular_velocity", unit: "°/s", datatype: "float", samplingRate: 2, minValue: -25, maxValue: 25, nominalValue: 0.42 },
        { name: "attitude_error", unit: "°", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 30, nominalValue: 1.15 },
        { name: "reaction_wheel_speed", unit: "RPM", datatype: "float", samplingRate: 1, minValue: -6000, maxValue: 6000, nominalValue: 1840 },
      ],
      COMM: [
        { name: "rssi", unit: "dBm", datatype: "float", samplingRate: 0.5, minValue: -115, maxValue: -40, nominalValue: -76.4 },
        { name: "packet_loss", unit: "%", datatype: "float", samplingRate: 0.2, minValue: 0, maxValue: 100, nominalValue: 1.2 },
        { name: "signal_strength", unit: "dBm", datatype: "float", samplingRate: 0.5, minValue: -115, maxValue: -40, nominalValue: -74.8 },
      ],
      PAYLOAD: [
        { name: "payload_power", unit: "W", datatype: "float", samplingRate: 1, minValue: 0, maxValue: 15, nominalValue: 4.8 },
        { name: "sensor_status", unit: "status", datatype: "integer", samplingRate: 0.1, minValue: 0, maxValue: 5, nominalValue: 1 },
      ],
    };

    const channelMap = new Map<string, any>();
    for (const [subType, specs] of Object.entries(channelSpecs)) {
      const sub = subsystemMap.get(subType);
      if (!sub) continue;

      for (const spec of specs) {
        let channel = await ctx.db
          .query("telemetryChannels")
          .withIndex("by_subsystem", (q) => q.eq("subsystemId", sub._id))
          .filter((q) => q.eq(q.field("name"), spec.name))
          .first();

        if (!channel) {
          const chId = await ctx.db.insert("telemetryChannels", {
            spacecraftId: spacecraft._id,
            subsystemId: sub._id,
            name: spec.name,
            unit: spec.unit,
            datatype: spec.datatype,
            samplingRate: spec.samplingRate,
            minValue: spec.minValue,
            maxValue: spec.maxValue,
          });
          channel = await ctx.db.get(chId);
        }
        channelMap.set(spec.name, channel);
      }
    }

    // Seed Models
    const existingModels = await ctx.db.query("models").collect();
    if (existingModels.length === 0) {
      await ctx.db.insert("models", {
        name: "Statistical EWMA Baseline",
        version: "v1.0.0",
        architecture: "statistical",
        dataset: "RVCE Synthetic Flight 2026",
        metrics: { f1: 0.88, precision: 0.85, recall: 0.92, falsePositiveRate: 0.08 },
        size: 14,
        latency: 0.8,
        ramUsage: 120,
        status: "deployed",
      });

      await ctx.db.insert("models", {
        name: "COSMOS-LSTM-Autoencoder",
        version: "v1.1.0",
        architecture: "lstm",
        dataset: "NASA SMAP/MSL + RVCE CubeSat",
        metrics: { f1: 0.92, precision: 0.94, recall: 0.90, falsePositiveRate: 0.04 },
        size: 184,
        latency: 18.5,
        ramUsage: 1420,
        status: "ready",
      });

      await ctx.db.insert("models", {
        name: "COSMOS-TCN-Edge (FP32)",
        version: "v2.0.0",
        architecture: "tcn",
        dataset: "RVCE Multiphysics Telemetry",
        metrics: { f1: 0.95, precision: 0.96, recall: 0.94, falsePositiveRate: 0.02 },
        size: 78,
        latency: 6.2,
        ramUsage: 540,
        status: "ready",
      });

      await ctx.db.insert("models", {
        name: "COSMOS-TCN-Edge (INT8 Quantized)",
        version: "v2.1.0-quant",
        architecture: "tcn",
        dataset: "RVCE Multiphysics Telemetry",
        metrics: { f1: 0.94, precision: 0.95, recall: 0.93, falsePositiveRate: 0.03 },
        size: 26,
        latency: 2.1,
        ramUsage: 210,
        status: "deployed",
      });
    }

    return {
      organizationId: org._id,
      missionId: mission._id,
      spacecraftId: spacecraft._id,
    };
  },
});

