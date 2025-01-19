"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMoveVideos } from "@/hooks/useFolders";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import React, { useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
interface Props {
  videoId: string;
  currentFolder: string;
  currentWorkspace: string;
  currentFolderName: string;
}

const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentWorkspace,
  currentFolderName,
}: Props) => {
  const {
    isSuccess,
    onFormSubmit,
    isFetching,
    folders,
    isPending,
    workspaces,
    isFolders,
    setValue,
  } = useMoveVideos(videoId, currentWorkspace, currentFolder);
  // const folder = folders.find((f) => f.id === currentFolder);
  const workspace = workspaces.find((f) => f.id === currentWorkspace);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isSuccess) ref.current?.click();
  }, [isSuccess]);

  return (
    <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
      <div className="boder-[1px] rounded-xl px-5 py-3">
        <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {currentFolderName ? (
          <p>{currentFolderName}</p>
        ) : (
          "This video has no folder"
        )}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="text-xs text-[#a4a4a4]">To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-sm">Workspaces</p>
          <Select onValueChange={(value) => setValue("workspaceId", value)}>
            <SelectTrigger onClick={()=>{
              console.log("sjbbsjbsjb");
              
            }} className="w-full">
             <p onClick={()=>{
              console.log("sjbbsjbsjb");
              
            }}>anbvahvhahavhav</p>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Workspaces</SelectLabel>
                <Separator className="mb-1" />
                {workspaces.map((space) => (
                  <SelectItem
                    className="text-muted-foreground"
                    key={space.id}
                    value={space.id}
                  >
                    {space.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-sm">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <Select onValueChange={(value) => setValue("folderId", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currentFolderName} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Folders</SelectLabel>
                    <Separator className="mb-1" />
                    {isFolders.map((folder, key) => (
                      <SelectItem
                        className="text-muted-foreground"
                        key={folder.id}
                        value={folder.id}
                      >
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <DialogClose ref={ref}></DialogClose>
      <Button
        disabled={!isFolders || isFolders.length == 0}
        isLoading={isPending}
        className={cn("bg-secondary-foreground text-secondary font-semibold ",
          (!isFolders || isFolders.length == 0)?"opacity-40 hover:opacity-25 disabled:opacity-45 disabled:hover:opacity-25":"hover:bg-secondary-foreground/80"
        )}
        type="submit"
      >
        Transfer
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
