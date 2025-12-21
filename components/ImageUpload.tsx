"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.image.generateUploadUrl);
  const writeImage = useMutation(api.image.writeImage);
  const deleteImage = useMutation(api.image.deleteImage);
  const images = useQuery(api.image.requestImagesUrls);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      // 1. Generate the upload URL
      const postUrl = await generateUploadUrl();

      // 2. POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();

      // 3. Save the image record in the database
      await writeImage({ storageId });

      // 4. Reset state
      clearImage();
      alert("Bill uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: Id<"images">) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage({ id });
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete image.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto p-4">
      {/* Upload Section */}
      <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Upload your bill
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Upload an image of your receipt to start splitting the bill.
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 flex flex-col items-center justify-center min-h-[300px] cursor-pointer
            ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-inner"
                : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/50"
            }
            ${selectedImage ? "border-solid border-slate-200 dark:border-slate-800" : ""}
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={!selectedImage ? triggerFileInput : undefined}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {selectedImage ? (
            <div className="relative w-full h-full flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                <Image
                  src={selectedImage}
                  alt="Selected receipt"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                disabled={isUploading}
                className="mt-4 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
              >
                Remove image and try another
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  PNG, JPG or WEBP (max. 10MB)
                </p>
              </div>
              <button className="mt-4 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all">
                Select File
              </button>
            </div>
          )}
        </div>

        {selectedImage && (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Process Bill"}
          </button>
        )}
      </div>

      {/* Viewing Section */}
      {images && images.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Your Uploaded Bills
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Click on a receipt to view details and parse it
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <Link
                key={img.id}
                href={`/receipts/${img.id}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer"
              >
                {img.url && (
                  <Image
                    src={img.url}
                    alt="Uploaded bill"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
                {/* View indicator */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-sm font-medium">
                    View Receipt →
                  </span>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(img.id as Id<"images">);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg z-10"
                  title="Delete image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
