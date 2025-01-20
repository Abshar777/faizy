import React, { useState, useRef, useEffect } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { Image } from "@nextui-org/image";
import { cn } from "@/lib/utils";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  setValues?: any;
  thumbnail?: string;
}

export default function ImageUploader({
  onImageUpload,
  errors,
  name,
  register,
  thumbnail,
  setValues
}: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    thumbnail || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items as unknown as any[];

      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageUpload?.(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onImageUpload]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValues(name, file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload?.(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <label htmlFor="thumbnail" className="text-[#9D9D9D] px-1 ">
        thumbnail
        <div
          className={cn(
            "w-full max-w-md mt-2 mx-auto h-[14rem]  border-2 border-dashed  border-primary-foreground/80 rounded-lg ",
            "hover:border-zinc-500  transition-colors cursor-pointer overflow-hidden bg-primary-foreground",
            errors[name] && "errInput"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            id="thumbnail"
            type="file"
            className="hidden"
            accept="image/*"

            onChange={handleImageChange}
          />
          {!selectedImage ? (
            <div className=" w-full flex items-center justify-center  h-full overflow-hidden ">
              <HiOutlineCloudUpload className="text-muted-foreground/70 text-2xl" />
            </div>
          ) : (
            <div
              onClick={() => {
                console.log("clicked");

                fileInputRef.current?.click();
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full group h-full relative"
            >
              <div className="absolute pointer-events-none w-full h-full bg-background/10 z-[10] backdrop-blur-lg flex items-center justify-center group-hover:opacity-100 opacity-0 transition-all duration-[.3] ease-in">
                <h1 className="text-white">change</h1>
              </div>
              <Image
                src={selectedImage}
                isBlurred={true}
                shadow="md"
                alt="Selected Image"
                className="w-full relative z-[0] h-full object-cover"
              />
            </div>
          )}
        </div>
      </label>
    </>
  );
}
