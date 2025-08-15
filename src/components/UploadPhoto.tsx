"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import Resizer from "react-image-file-resizer";

type Props = {
  image: any;
  setImage: (image: any) => void;
  title?: string;
};

const UploadPhoto = ({ setImage, image, title }: Props) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const resizeFile = (file: any) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1080,
        1080,
        "WEBP",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const handlePreviewClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoName(null);
    setPhotoSize(null);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (file) {
      try {
        const image = (await resizeFile(file)) as File; // Resize the image to 300x300 pixels
        if (image) {
          const previewUrl = URL.createObjectURL(image);
          setPhotoPreview(previewUrl);
          setPhotoName(image?.name || "");
          setPhotoSize(image?.size || null);

          setImage(image); // Set the resized image to the state
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const formatSize = (bytes: number) => {
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mb-10 p-6 w-full md:w-xl mx-auto border border-default-300 dark:border-gray-700 rounded-xl shadow-sm  dark:bg-gray-900">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
        {title || "Upload Photo"}
      </h3>

      {/* Drop & Click Area */}
      <div
        onClick={handlePreviewClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        className="w-40 h-40 mx-auto rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group focus:outline-none"
      >
        {photoPreview || image ? (
          <Image
            priority
            src={photoPreview || image}
            height={500}
            width={500}
            alt="Uploaded Photo"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-indigo-500">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">Click or Drag to upload</span>
          </div>
        )}
      </div>

      {/* File Info & Remove Button */}

      {(photoName || image) && (
        <div className="mt-4 text-center">
          {photoName && (
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {photoName} • {photoSize ? formatSize(photoSize) : ""}
            </p>
          )}
          <button
            onClick={handleRemovePhoto}
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
          >
            <X className="w-4 h-4" />
            Remove Photo
          </button>
        </div>
      )}

      {/* Hidden Input */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
    </div>
  );
};

export default UploadPhoto;
