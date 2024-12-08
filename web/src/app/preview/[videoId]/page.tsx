import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getPreviewVideo, getVideoComments } from "@/actions/video";
import { getUserProfile } from "@/actions/user";
import VideoPreview from "@/components/global/videos/preview";
import LandingPageNavBar from "@/app/(web)/_components/LandingPageNavBar";

interface Props {
  params: {
    videoId: string;
  };
}

const VideoPreviewPage = async ({ params: { videoId } }: Props) => {
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
      <div className="w-full flex flex-col min-h-screen h-full bg-primary-foreground">
        <div className="py-7 px-10 xl:px-10 ">
          <LandingPageNavBar />
        </div>
        <div className="md:px-10 px-8 overflow-hidden flex-1  w-screen  py-3  bg-primary-foreground">
          <VideoPreview videoId={videoId} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default VideoPreviewPage;
