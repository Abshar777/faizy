import React from "react";
import {
  getNotifications,
  getUserProfile,
  onAuthenticateUser,
} from "@/../actions/user";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { getPreviewVideo, getVideoComments } from "../../../../../../actions/video";
import VideoPreview from "@/components/global/videos/preview";
import { VideoInfo } from "@/components/global/videos/videoInfo";

interface Props {
  params: {
    workspaceId: string;
    videoId: string;
  };
  children: React.ReactNode;
}

const layout = async ({
  children,
  params: { workspaceId, videoId },
}: Props) => {
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["video", videoId],
    queryFn: () => getPreviewVideo(videoId),
  });
  await query.prefetchQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  await query.prefetchQuery({
    queryKey: ["preview-video"],
    queryFn: () => getPreviewVideo(videoId),
  });
  await query.prefetchQuery({
    queryKey: ["video-comments"],
    queryFn: () => getVideoComments(videoId),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <VideoInfo workspaceId={workspaceId} />
      {children}
    </HydrationBoundary>
  );
};

export default layout;
