import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// write image table with storage id 

export const writeImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.insert("images", {
      storageId: args.storageId,
      uploadedBy: userId,
      uploadedAt: Date.now(),
    });
  },
});


// request images uploaded by a user
export const requestImagesUrls = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const images = await ctx.db
      .query("images")
      .withIndex("by_user", (q) => q.eq("uploadedBy", userId))
      .collect();

    return Promise.all(
      images.map(async (image) => ({
        id: image._id,
        url: await ctx.storage.getUrl(image.storageId),
      }))
    );
  },
});

// delete an image by id and remove it from storage
export const deleteImage = mutation({
  args: {
    id: v.id("images"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const image = await ctx.db.get(args.id);
    if (!image) {
      throw new Error("Image not found");
    }

    if (image.uploadedBy !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.storage.delete(image.storageId);
    await ctx.db.delete(args.id);
  },
});