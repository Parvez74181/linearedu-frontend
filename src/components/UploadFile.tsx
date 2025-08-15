"use client";
import { Input, Tooltip } from "@heroui/react";
import { ArrowUpRight, File } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, useRef } from "react";

type Props = {
  file: any;
  title?: any;
  setFile: (file: any) => void;
  action?: any;
};
const UploadFile = ({ file, setFile, title, action }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  return (
    <>
      <div className="flex items-center w-full gap-5 flex-col">
        <Input
          ref={fileInputRef}
          classNames={{
            inputWrapper: "border-default-300",
            mainWrapper: "w-full",
          }}
          type="file"
          label={title || `Choose File`}
          radius="sm"
          size="lg"
          labelPlacement="outside"
          variant="bordered"
          startContent={<File />}
          accept="application/pdf"
          onChange={handleOnChange}
        />

        {file && action === "Update" && (
          <Input
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            placeholder={`${title} File url`}
            radius="sm"
            size="lg"
            required
            labelPlacement="outside"
            label="File Url"
            variant="bordered"
            endContent={
              <Tooltip content="View file">
                <Link href={file} target="_blank">
                  <ArrowUpRight />
                </Link>
              </Tooltip>
            }
            isReadOnly
            defaultValue={file}
          />
        )}
      </div>
    </>
  );
};

export default UploadFile;
