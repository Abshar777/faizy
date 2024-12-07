"use client";
import FolderDuotone from "@/components/icons/folder-duotone";
import { ArrowRight } from "lucide-react";
import React from "react";
import Folder from "./folder";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaceFolders } from "../../../../actions/workspace";
import { useMutationDataState } from "@/hooks/useMutation";
import { FoldersProps } from "@/types/index.type";
import { Skeleton } from "@nextui-org/skeleton";
import { useAppDispatch } from "@/store/store";
import { FOLDERS } from "@/store/slices/folders";
import Videos from "../videos";

interface Props {
  workspaceId: string;
}

const Folders = ({ workspaceId }: Props) => {
  const dispatch = useAppDispatch();
  const { data, isFetched } = useQueryData(["workspace-folders"], () => {
    return getWorkspaceFolders(workspaceId);
  });
  const { latestVaribales } = useMutationDataState(["create-folder"]);
  let { data: folders, status } = data as FoldersProps;
  if (isFetched && folders) {
    dispatch(FOLDERS({folders:folders}));
  }
  return (
    <div className="flex flex-col gap-2 px-3">
      <div className="flex    items-center justify-between">
        <div className="heading flex items-center gap-2">
          <FolderDuotone />{" "}
          <h2 className="text-xl mt-1 text-muted-foreground font-semibold ">
            Folders
          </h2>
        </div>
        <div className="flex cursor-pointer group  items-center gap-2 mt-1">
          <p className="transition-all duration-[.3] ease-in  text-sm opacity-50 group-hover:opacity-100">
            See all
          </p>
          <ArrowRight
            className="transition-all duration-[.3] ease-in group-hover:translate-x-0 -translate-x-1 text-xs group-hover:text-primary opacity-50 group-hover:opacity-100"
            size={20}
          />
        </div>
      </div>
      <ScrollArea className="  w-full overflow-hidden   mt-2">
        <div
          className={cn(
            "flex  w-full  items-center gap-2",
            status!==200 && "justify-center"
          )}
        >
          {status!==200 ? (
            <p className="text-sm text-muted-foreground">No folders found</p>
          ) : (
            <>
              {latestVaribales && latestVaribales.status === "pending" && (
                <Folder
                  name={latestVaribales.variables.name}
                  id={latestVaribales.variables.id}
                  optimistic={true}
                />
              )}
              {folders.map((folder) => (
                <Folder key={folder.id} count={folder._count.videos || 0} name={folder.name} id={folder.id} />
              ))}
            </>
          )}
        </div>
        <ScrollBar className="opacity-0" orientation="horizontal" />
      </ScrollArea>
      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="folder-videos"
      />
    </div>
  );
};

export default Folders;
