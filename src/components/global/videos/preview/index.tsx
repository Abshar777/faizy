"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React, { useEffect, useRef } from "react";
import { FaEye, FaShareAlt, FaDownload } from "react-icons/fa";
import { getPreviewVideo } from "../../../../../actions/video";
import { useRouter } from "nextjs-toploader/app";
import { VideoPreviewProp } from "@/types/index.type";
import { CopyLink } from "../copyLink";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button, ButtonGroup } from "@nextui-org/react";
import VideoPlayer from "../videoPlayer";
import { MediaTimeUpdateEventDetail } from "@vidstack/react";
import { useUpdateViews } from "@/hooks/useUpadeteViews";

interface Props {
  videoId: string;
}

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();
  const { data, isFetching } = useQueryData(["video", videoId], () =>
    getPreviewVideo(videoId)
  );
  const { mutate } = useUpdateViews();

  const VideoRef = useRef<HTMLVideoElement>(null);
  const { data: video, status, author } = data as VideoPreviewProp;
  const daysAgo = Math.floor(
    video &&
      (new Date().getTime() - new Date(video.createdAt.getTime()).getTime()) /
        (1000 * 60 * 60 * 24)
  );
  if (status !== 200) router.push("/");
  const fn = {
    onPlay: () => VideoRef.current && VideoRef.current.play(),
    onPause: () => VideoRef.current && VideoRef.current.pause(),
    onTimeUpdate: (e: MediaTimeUpdateEventDetail) => {
      VideoRef.current && (VideoRef.current.currentTime = e.currentTime);
    },
  };

  useEffect(() => {
    mutate({ videoId });
  }, [mutate, videoId]);

  return (
    video && (
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-5 lg:px-2   gap-3">
        <div className="flex flex-col lg:col-span-2 gap-y-8">
          <div className="flex flex-col gap-y-6">
            <div className="flex gap-x-5 items-ceneter justify-between">
              <h2 className="text-white flex lg:text-4xl md:text-3xl text-2xl capitalize font-extrabold">
                {video?.title}
              </h2>
              <div className="flex items-center mt-2">
                <p className="text-muted-foreground/80 flex  items-center gap-x-2 text-sm">
                  <FaEye className="text-md" /> {video?.views}
                </p>
                {author && (
                  <>
                    {/* <EditVideo
              videoId={videoId}
              title={video.title as string}
              description={video.description as string}
            /> */}
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent  relative lg:h-[30rem] md:h-[25rem] sm:h-[20rem] h-[15rem]  ">
              <div className="absolute w-full h-full z-0">
                <video
                  muted
                  ref={VideoRef}
                  preload="metadata"
                  className="w-full    h-full  opacity-50 blur-2xl    rounded-xl"
                  controls={false}
                  crossOrigin="anonymous"
                  src={"https://files.vidstack.io/sprite-fight/720p.mp4"}
                />
              </div>

              <VideoPlayer
                thumbnail={video?.thumbnail}
                title={video?.title || ""}
                fn={fn}
                video={video?.source}
              />
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-x-1">
                <Avatar>
                  <AvatarImage src={video?.User?.image as string} />
                  <AvatarFallback>
                    {video?.User?.firstname?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col px-2">
                  <p className="text-secondary-foreground text-semibold">
                    {video?.User?.firstname} {video?.User?.lastname}
                  </p>
                  <p className="text-secondary-foreground/80 text-xs">
                    {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                  </p>
                </div>
              </div>
              <ButtonGroup size="md" variant="flat" isIconOnly>
                <CopyLink videoId={videoId} size="md" />
                <Button>
                  <FaDownload />
                </Button>
              </ButtonGroup>
            </div>

            <div className="flex flex-col bg-muted-foreground/5 p-4 rounded-lg text-2xl gap-y-4">
              <div className="flex gap-x-5 items-center justify-between">
                <p className="text-secondary-foreground font-semibold text-lg">
                  Description
                </p>
                {author ? (
                  <>
                    {/* <EditVideo
              videoId={videoId}
              title={video.title as string}
              description={video.description as string}
            /> */}
                  </>
                ) : (
                  <></>
                )}
              </div>
              <p className="text-muted-foreground  text-sm">
                {video?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VideoPreview;
