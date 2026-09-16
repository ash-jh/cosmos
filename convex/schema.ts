import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  organizationMembers: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    role: v.union(
      v.literal("admin"),
      v.literal("operator"),
      v.literal("viewer")
    ),
  }).index("by_org_and_user", ["organizationId", "userId"]),

  missions: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    missionType: v.union(
      v.literal("cubesat"),
      v.literal("smallsat"),
      v.literal("cansat"),
      v.literal("other")
    ),
    status: v.union(
      v.literal("planning"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("archived")
    ),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  spacecraft: defineTable({
    missionId: v.id("missions"),
    name: v.string(),
    noradId: v.optional(v.string()),
    status: v.union(
      v.literal("nominal"),
      v.literal("warning"),
      v.literal("critical"),
      v.literal("offline")
    ),
    orbitConfig: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_mission", ["missionId"]),

  subsystems: defineTable({
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
    status: v.union(
      v.literal("nominal"),
      v.literal("warning"),
      v.literal("critical"),
      v.literal("offline")
    ),
    description: v.optional(v.string()),
  }).index("by_spacecraft", ["spacecraftId"]),

  telemetryChannels: defineTable({
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
  })
    .index("by_spacecraft", ["spacecraftId"])
    .index("by_subsystem", ["subsystemId"]),

  telemetryData: defineTable({
    spacecraftId: v.id("spacecraft"),
    channelId: v.id("telemetryChannels"),
    timestamp: v.number(),
    value: v.number(),
  }).index("by_spacecraft_and_timestamp", ["spacecraftId", "timestamp"]),

  alerts: defineTable({
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("critical")
    ),
    type: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("acknowledged"),
      v.literal("resolved")
    ),
    message: v.string(),
    relatedChannels: v.array(v.id("telemetryChannels")),
  }).index("by_spacecraft", ["spacecraftId"]),

  anomalyResults: defineTable({
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    modelId: v.optional(v.id("models")),
    score: v.number(),
    threshold: v.number(),
    severity: v.string(),
    affectedChannels: v.array(v.id("telemetryChannels")),
    status: v.union(
      v.literal("detected"),
      v.literal("investigating"),
      v.literal("resolved"),
      v.literal("false_positive")
    ),
  }).index("by_spacecraft", ["spacecraftId"]),

  rcaResults: defineTable({
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
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  }).index("by_anomaly", ["anomalyId"]),

  faultInjections: defineTable({
    simulationId: v.id("simulationRuns"),
    spacecraftId: v.id("spacecraft"),
    timestamp: v.number(),
    subsystem: v.string(),
    faultType: v.string(),
    parameters: v.any(),
    duration: v.number(),
  }).index("by_simulation", ["simulationId"]),

  simulationRuns: defineTable({
    spacecraftId: v.id("spacecraft"),
    scenario: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    result: v.optional(v.any()),
  }).index("by_spacecraft", ["spacecraftId"]),

  models: defineTable({
    name: v.string(),
    version: v.string(),
    architecture: v.union(
      v.literal("lstm"),
      v.literal("tcn"),
      v.literal("statistical")
    ),
    dataset: v.optional(v.string()),
    metrics: v.optional(
      v.object({
        f1: v.optional(v.number()),
        precision: v.optional(v.number()),
        recall: v.optional(v.number()),
        falsePositiveRate: v.optional(v.number()),
      })
    ),
    size: v.optional(v.number()),
    latency: v.optional(v.number()),
    ramUsage: v.optional(v.number()),
    status: v.union(
      v.literal("training"),
      v.literal("ready"),
      v.literal("deployed"),
      v.literal("archived")
    ),
  }),
});
