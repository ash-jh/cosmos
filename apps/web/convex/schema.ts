import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  missions: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    missionType: v.string(),
    status: v.string(),
    description: v.string(),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  spacecraft: defineTable({
    missionId: v.id("missions"),
    name: v.string(),
    status: v.string(),
    noradId: v.optional(v.string()),
    orbitConfig: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_mission", ["missionId"]),

  subsystems: defineTable({
    spacecraftId: v.id("spacecraft"),
    name: v.string(),
    type: v.string(),
    status: v.string(),
    description: v.string(),
  }).index("by_spacecraft", ["spacecraftId"]),

  telemetryChannels: defineTable({
    spacecraftId: v.id("spacecraft"),
    subsystemId: v.id("subsystems"),
    name: v.string(),
    unit: v.string(),
    datatype: v.string(),
    samplingRate: v.number(),
    minValue: v.optional(v.number()),
    maxValue: v.optional(v.number()),
    description: v.string(),
  })
    .index("by_spacecraft", ["spacecraftId"])
    .index("by_subsystem", ["subsystemId"]),

  alerts: defineTable({
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    severity: v.string(),
    type: v.string(),
    status: v.string(),
    message: v.string(),
    relatedChannels: v.array(v.string()),
  }).index("by_spacecraft", ["spacecraftId"]),

  anomalyResults: defineTable({
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    modelId: v.optional(v.id("models")),
    score: v.number(),
    threshold: v.number(),
    severity: v.string(),
    affectedChannels: v.array(v.string()),
    status: v.string(),
  }).index("by_spacecraft", ["spacecraftId"]),

  rcaResults: defineTable({
    anomalyId: v.id("anomalyResults"),
    candidateSubsystem: v.string(),
    candidateCause: v.string(),
    confidence: v.number(),
    evidence: v.array(v.string()),
    status: v.string(),
  }).index("by_anomaly", ["anomalyId"]),

    missionEvents: defineTable({
    missionId: v.id("missions"),
    spacecraftId: v.id("spacecraft"),

    timestamp: v.number(),

    eventType: v.string(),
    severity: v.string(),

    title: v.string(),
    message: v.string(),

    source: v.string(),

    anomalyId: v.optional(v.id("anomalyResults")),
    simulationId: v.optional(v.id("simulationRuns")),

    subsystem: v.optional(v.string()),

    metadata: v.optional(v.any()),
  })
    .index("by_spacecraft", ["spacecraftId"])
    .index("by_mission", ["missionId"])
    .index("by_timestamp", ["timestamp"]),

  faultInjections: defineTable({
    simulationId: v.id("simulationRuns"),
    timestamp: v.number(),
    subsystem: v.string(),
    faultType: v.string(),
    parameters: v.any(),
    duration: v.number(),
  }).index("by_simulation", ["simulationId"]),

  simulationRuns: defineTable({
    spacecraftId: v.id("spacecraft"),
    scenario: v.string(),
    status: v.string(),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    result: v.optional(v.any()),
  }).index("by_spacecraft", ["spacecraftId"]),

  models: defineTable({
    name: v.string(),
    version: v.string(),
    architecture: v.string(),
    dataset: v.string(),
    metrics: v.any(),
    size: v.optional(v.number()),
    latency: v.optional(v.number()),
    ramUsage: v.optional(v.number()),
    status: v.string(),
  }).index("by_name", ["name"]),
});