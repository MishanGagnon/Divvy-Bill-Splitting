"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";

export function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto p-4">
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
              className="mt-4 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          onClick={() => alert("Image upload functionality not wired up yet!")}
        >
          Process Bill
        </button>
      )}
    </div>
  );
}
