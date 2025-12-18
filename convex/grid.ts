import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all 9 cells in order (realtime)
export const list = query({
    args: {},
    handler: async (ctx) => {
        const cells = await ctx.db
            .query("gridCells")
            .withIndex("byIndex", (q) => q)
            .collect();

        // Ensure stable order
        return cells.sort((a, b) => a.index - b.index);
    },
});

// Click a cell: mark if empty; unmark if you're the marker (optional)
export const toggle = mutation({
    args: { index: v.number() },
    handler: async (ctx, { index }) => {

        // This now uses Convex approved method to find user info
        // which is tto first find user ID then query the users table
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        const user = await ctx.db.get("users", userId);

        const userName = user?.name;
        if (!userName) {
            throw new Error("User not found");
        }

        // Fetch the cell
        const cell = await ctx.db
            .query("gridCells")
            .withIndex("byIndex", (q) => q.eq("index", index))
            .unique();

        if (!cell) {
            throw new Error("Cell not initialized");
        }

        // If unmarked -> mark it
        if (!cell.markedBy) {
            await ctx.db.patch(cell._id, {
                markedBy: userId,
                markedByName: userName,
                markedAt: Date.now(),
            });
            return { status: "marked" as const };
        }

        // If marked by me -> unmark (recommended behavior)
        if (cell.markedBy === userId) {
            await ctx.db.patch(cell._id, {
                markedBy: undefined,
                markedByName: undefined,
                markedAt: undefined,
            });
            return { status: "unmarked" as const };
        }

        // Otherwise: someone else owns it
        return { status: "taken" as const, by: cell.markedByName };
    },
});

export const init = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("gridCells").collect();
        if (existing.length > 0) return;

        for (let i = 0; i < 9; i++) {
            await ctx.db.insert("gridCells", { index: i });
        }
    },
});
