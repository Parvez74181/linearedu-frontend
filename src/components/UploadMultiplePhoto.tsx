"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Icon, ImageIcon, PiIcon, Plus, X } from "lucide-react";
import NextImage from "next/image";
import Resizer from "react-image-file-resizer";
import { Button, Image, Input } from "@heroui/react";

type Props = {
  images: any;
  setImages: (avatar: any) => void;
  type?: string;
  captions: string[];
  setCaptions: (captions: string[]) => void;
};

const UploadMultiplePhoto = ({ setImages, images, type = "gallery", captions, setCaptions }: Props) => {
  const [photoPreview, setPhotoPreview] = useState<string[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files) handleFile(files);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files || []);
    if (files) handleFile(files);
  };

  const handleFile = async (files: File[]) => {
    if (!files?.length) return;

    try {
      // Process all files in parallel
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const image = (await resizeFile(file)) as File;

          return {
            image,
            previewUrl: URL.createObjectURL(image),
            caption: "",
          };
        })
      );

      // Single state update for better performance
      setPhotoPreview((prev) => [...(prev || []), ...processedFiles.map((f) => f.previewUrl)]);
      setImages((prev: any) => [...prev, ...processedFiles.map((f) => f.image)]);
      setCaptions([...captions, ...processedFiles.map((f) => f.caption)]);
    } catch (err) {
      console.error("Error processing files:", err);
      // Consider adding error handling/UI feedback here
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add("border-dashed");

    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-dashed");

    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveImage = (index: number) => {
    setPhotoPreview((prev: any) => prev.filter((_: any, i: any) => i !== index));
    setImages((prev: any) => prev.filter((_: any, i: any) => i !== index));
    setCaptions(captions.filter((_: any, i: number) => i !== index));
  };

  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  return (
    <>
      <div className="flex flex-col w-full items-center justify-center gap-2">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className=" p-6 w-full md:w-xl mx-auto border-2 border-default-300 dark:border-gray-700 rounded-xl shadow-sm  dark:bg-gray-900"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
            Choose Images
          </h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-40 h-40 mx-auto rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group focus:outline-none"
          >
            <div className="flex flex-col items-center cursor-pointer justify-center text-gray-400 group-hover:text-indigo-500">
              <ImageIcon className="w-8 h-8 mb-1" />
              <span className="text-xs text-center">Click or Drag to upload</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {photoPreview?.map((url: any, index: any) => (
          <div key={index} className="relative w-56 h-56 rounded-lg overflow-hidden">
            <Image
              as={NextImage}
              src={url}
              alt={`Product ${index + 1}`}
              width={500}
              height={0}
              className="w-full h-full object-cover aspect-square"
              removeWrapper
            />
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="solid"
              className="absolute top-1 right-1 z-50 "
              onPress={() => handleRemoveImage(index)}
            >
              <X />
            </Button>

            <Input
              value={captions[index] || ""}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              className="absolute bottom-0 z-50  w-full"
              placeholder="Write Caption..."
              radius="none"
              size="sm"
            >
              caption
            </Input>
          </div>
        ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple={type === "pride" ? false : true}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </>
  );
};

export default UploadMultiplePhoto;
