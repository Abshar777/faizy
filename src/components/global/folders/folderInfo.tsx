"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { getFolderInfo } from "../../../../actions/workspace";
import { FolderProp } from "@/types/index.type";
import { Button } from "@nextui-org/button";
import { ChevronLeftIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  folderId: string;
  workspaceId: string;
}

const FolderInfo = ({ folderId, workspaceId }: Props) => {
  const { data } = useQueryData(["folder-info"], () => getFolderInfo(folderId));
  const { data: Folder } = data as FolderProp;
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
          className="rounded-full scale-[.8] active:scale-[.9] active:-translate-x-2  bg-muted-foreground/10 "
          isIconOnly
        >
          <ChevronLeftIcon size={20} />
        </Button>
        <h1 className=" text-muted-foreground">{Folder?.name}</h1>
      </div>
    </div>
  );
};

export default FolderInfo;
