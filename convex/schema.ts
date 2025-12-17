import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  gridCells: defineTable({
    index: v.number(),
    markedBy: v.optional(v.string()),
    markedByName: v.optional(v.string()),
    markedAt: v.optional(v.number()),
  }).index("byIndex", ["index"]),
});
