"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { ChevronLeftIcon, TrashIcon } from "lucide-react";
import { useRouter } from 'nextjs-toploader/app';

interface Props {
  workspaceId: string;
}

export const VideoInfo = ({  workspaceId }: Props) => {

  const router = useRouter();
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push(`/dashboard/${workspaceId}`);
  };
  return (
    <div className="mt-3">
      <div className="flex gap-2 items-center ">
        <Button
          onClick={handleBack}
          size="sm"
          className="rounded-full scale-[.7] active:scale-[.8] active:-translate-x-2  bg-muted-foreground/10 "
          isIconOnly
        >
          <ChevronLeftIcon size={15} />
        </Button>
        <h1 className=" text-muted-foreground text-sm">Back To Library</h1>
      </div>
    </div>
  );
};
