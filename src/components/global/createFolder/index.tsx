"use client";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateFolder } from "@/hooks/useCreateFolders";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import React from "react";

interface Props {
  workspaceId: string;
}

const CreateFolder = ({ workspaceId }: Props) => {
  const isMobile = useIsMobile(1000);
  const { onCreateNewFolder } = useCreateFolder(workspaceId);
  return (
    <Tooltip
      delay={700}
      className="ml-2"
      placement="bottom"
      color="secondary"
      showArrow
      content="Create Folder"
    >
      <Button
        onClick={onCreateNewFolder}
        size={isMobile ? "sm" : "md"}
        className="bg-muted-foreground/5 hover:bg-muted-foreground/10  text-sm text-muted-foreground flex items-center gap-2 py-6  rounded-2xl"
      >
        <FolderPlusDuotine />
        {!isMobile && "Create Folder"}
      </Button>
    </Tooltip>
  );
};

export default CreateFolder;
