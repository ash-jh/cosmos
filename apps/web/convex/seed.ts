import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const initializeCOSMOS = mutation({
  args: {},

  returns: v.object({
    organizationId: v.id("organizations"),
    missionId: v.id("missions"),
    spacecraftId: v.id("spacecraft"),
  }),

  handler: async (ctx) => {
    // ---------------------------------------------------------
    // Organization
    // ---------------------------------------------------------

    let organization = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "rvce"))
      .unique();

    let organizationId;

    if (organization) {
      organizationId = organization._id;
    } else {
      organizationId = await ctx.db.insert("organizations", {
        name: "RVCE",
        slug: "rvce",
        createdAt: Date.now(),
      });
    }

    // ---------------------------------------------------------
    // Mission
    // ---------------------------------------------------------

    let mission = await ctx.db
      .query("missions")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) =>
        q.eq(q.field("name"), "RVCE CubeSat-01")
      )
      .first();

    let missionId;

    if (mission) {
      missionId = mission._id;
    } else {
      missionId = await ctx.db.insert("missions", {
        organizationId,
        name: "RVCE CubeSat-01",
        missionType: "CubeSat",
        status: "active",
        description:
          "Reference CubeSat mission for the COSMOS Phase I mission-operations platform.",
        createdAt: Date.now(),
      });
    }

    // ---------------------------------------------------------
    // Spacecraft
    // ---------------------------------------------------------

    let spacecraft = await ctx.db
      .query("spacecraft")
      .withIndex("by_mission", (q) =>
        q.eq("missionId", missionId)
      )
      .filter((q) =>
        q.eq(q.field("name"), "COSMOS-SAT-01")
      )
      .first();

    let spacecraftId;

    if (spacecraft) {
      spacecraftId = spacecraft._id;
    } else {
      spacecraftId = await ctx.db.insert("spacecraft", {
        missionId,
        name: "COSMOS-SAT-01",
        status: "nominal",
        createdAt: Date.now(),
      });
    }

    // ---------------------------------------------------------
    // Subsystems
    // ---------------------------------------------------------

    const subsystems = [
      {
        name: "Electrical Power System",
        type: "EPS",
        description: "Battery, power bus and electrical health.",
      },
      {
        name: "Attitude Determination & Control",
        type: "ADCS",
        description: "Attitude estimation and control.",
      },
      {
        name: "On-Board Computer",
        type: "OBC",
        description: "On-board computing and software health.",
      },
      {
        name: "Communications",
        type: "COMM",
        description: "Telemetry and communications subsystem.",
      },
      {
        name: "Payload",
        type: "PAYLOAD",
        description: "Mission payload subsystem.",
      },
      {
        name: "Thermal",
        type: "THERMAL",
        description: "Spacecraft thermal monitoring.",
      },
    ];

    for (const subsystem of subsystems) {
      const existing = await ctx.db
        .query("subsystems")
        .withIndex("by_spacecraft", (q) =>
          q.eq("spacecraftId", spacecraftId)
        )
        .filter((q) =>
          q.eq(q.field("type"), subsystem.type)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("subsystems", {
          spacecraftId,
          name: subsystem.name,
          type: subsystem.type,
          status: "nominal",
          description: subsystem.description,
        });
      }
    }

    return {
      organizationId,
      missionId,
      spacecraftId,
    };
  },
});