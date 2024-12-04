"use client";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { IoLink } from "react-icons/io5";
import { toast } from "sonner";

interface Props {
  videoId: string;
  className?: string;
  variant?:
    | "ghost"
    | "light"
    | "shadow"
    | "solid"
    | "bordered"
    | "flat"
    | "faded";
}

export const CopyLink = ({ videoId, className, variant }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const onCopyClipBoard = async (e: React.MouseEvent<HTMLButtonElement>) => {
   try {
    setIsDisabled(true);
    e.stopPropagation();
    await navigator.clipboard.writeText(
      `${window.location.origin}/preview/${videoId}`
    );
    toast.success("Link Copied", {
      description: "You can now share the link with others",
    });
    setTimeout(() => {
      setIsDisabled(false);
      toast.dismiss();
    }, 2000);
    } catch (error) {
      setIsDisabled(false);
      toast.error("Failed to copy link");
    }
  };
  
  return (
    <Button
      isIconOnly
      size="sm"
      className={cn(className, "p-0")}
      variant={variant}
      onClick={onCopyClipBoard}
      isDisabled={isDisabled}
    >
      <IoLink className="" />
    </Button>
  );
};
