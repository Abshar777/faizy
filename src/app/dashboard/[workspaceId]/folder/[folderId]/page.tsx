import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";
import {
  getAllUserVideos,
  getFolderInfo,
} from "../../../../../../actions/workspace";
import FolderInfo from "@/components/global/folders/folderInfo";

interface Props {
  params: {
    workspaceId: string;
    folderId: string;
  };
}

const page = async ({ params: { workspaceId, folderId } }: Props) => {
  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: ["folder-videos"],
    queryFn: () => getAllUserVideos(folderId),
  });
  await query.prefetchQuery({
    queryKey: ["folder-info"],
    queryFn: () => getFolderInfo(folderId),
  });
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo workspaceId={workspaceId} folderId={folderId} />
    </HydrationBoundary>
  );
};

export default page;
