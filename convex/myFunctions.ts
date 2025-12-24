import { v } from "convex/values";
import { query, mutation, action, internalMutation } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listNumbers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const numbers = await ctx.db
      .query("numbers")
      // Ordered by _creationTime, return most recent
      .order("desc")
      .take(args.count);
    const userId = await getAuthUserId(ctx);
    const user = userId === null ? null : await ctx.db.get("users", userId);
    return {
      viewer: user?.name || user?.email || null,
      numbers: numbers.reverse().map((number) => number.value),
    };
  },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert("numbers", { value: args.value });

    console.log("Added new document with id:", id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Action implementation.
  handler: async (ctx, args) => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});

/**
 * Dev tool: Clear all receipt-related data from the database and storage.
 * Use with caution!
 */
export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Collect all storage IDs from both receipts and images tables
    const storageIds = new Set<Id<"_storage">>();
    
    const receipts = await ctx.db.query("receipts").collect();
    for (const r of receipts) {
      if (r.imageID) storageIds.add(r.imageID);
    }

    const images = await ctx.db.query("images").collect();
    for (const img of images) {
      if (img.storageId) storageIds.add(img.storageId);
    }

    // 2. Delete all files from storage
    for (const storageId of storageIds) {
      try {
        await ctx.storage.delete(storageId);
      } catch (e) {
        console.error(`Failed to delete storage file ${storageId}:`, e);
      }
    }

    // 3. Delete all records from tables
    const tables = ["receipts", "images", "receiptItems", "memberships", "shareCodes"] as const;
    let deletedCount = 0;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
        deletedCount++;
      }
    }

    return { 
      success: true, 
      message: `Cleared ${storageIds.size} files and ${deletedCount} database records.` 
    };
  },
});
