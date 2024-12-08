"use client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getPreviewVideo } from "@/actions/video";
import { getUserProfile } from "@/actions/user";
import VideoPreview from "@/components/global/videos/preview";
import { VideoInfo } from "@/components/global/videos/videoInfo";
import { useParams } from "next/navigation";

interface Props {
  params: {
    videoId: string;
  };
}

const VideoPreviewPage = ({ params: { videoId } }: Props) => {
  const query = new QueryClient();

  useEffect(() => {
    (async () => {
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
    })();
  }, []);
  const { workspaceId } = useParams();

  return (
      <div className="px-1  flex-1  w-full  py-3  bg-primary-foreground">
        <VideoPreview videoId={videoId} />
      </div>
  );
};

export default VideoPreviewPage;
