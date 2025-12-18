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

  // RECEIPT PARSING APP TABLES
  receipts: defineTable({
    // Image info
    imageID: v.string(), // Convex File ID
    createdAt: v.number(),

    // Amounts info
    totalCents: v.optional(v.number()),
    taxCents: v.optional(v.number()),
    tipCents: v.optional(v.number()),

    // Status
    // TODO: consider adding a "pending" status, incase it needs to be reviewed by host
    status: v.string(), // "parsed" | "error" | "paid" 
  }),
  receiptItems: defineTable({

    receiptId: v.id("receipts"),
    name: v.string(),
    quantity: v.number(),
    priceCents: v.optional(v.number()),

  }).index("by_receipt", ["receiptId"]),
  receiptModifiers: defineTable({

    itemId: v.id("receiptItems"),
    name: v.string(),
    priceCents: v.optional(v.number()),

  }).index("by_item", ["itemId"]),



});
