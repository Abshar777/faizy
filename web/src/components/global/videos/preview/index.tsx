"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React, { useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa";
import { MdDownloading } from "react-icons/md";
import { getPreviewVideo } from "@/actions/video";
import { useRouter } from "nextjs-toploader/app";
import { VideoPreviewProp } from "@/types/index.type";
import { CopyLink } from "../copyLink";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";
import VideoPlayer from "../videoPlayer";
import { MediaTimeUpdateEventDetail } from "@vidstack/react";
import { useUpdateViews } from "@/hooks/useUpadeteViews";
import RichLink from "../richLink";
import { truncateString } from "@/util/string";
import TabMenu from "../../tabs";
import AiTools from "../../AiTools";
import VideoTranscript from "../../video-transcript";
import Activities from "../../activities";
import EditVideo from "../editVideo";
import { config } from "dotenv";
config();

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
      if (VideoRef.current && e.currentTime !== Infinity) {
        VideoRef.current.currentTime = e.currentTime;
      } else {
        if (VideoRef.current) VideoRef.current.currentTime = 0;
      }
    },
  };
  let src = video.source;
  let stremUrl =
    process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL ||
    "https://d3m6ajsnw89gp6.cloudfront.net";

  if (video.title !== "Source Fight" && video.title !== "Agenet Fight") {
    src = `${stremUrl}/${video.source}#1`;
  }

  useEffect(() => {
    mutate({ videoId });
  }, [mutate, videoId]);

  return (
    video && (
      <div className="grid  grid-cols-1 xl:grid-cols-3 lg:py-5 xl:px-2   gap-3">
        <div className="flex flex-col xl:col-span-2 gap-y-8">
          <div className="flex flex-col gap-y-6">
            <div className="flex gap-x-5 items-ceneter justify-between">
              <h2 className="text-white flex lg:text-4xl md:text-3xl text-2xl capitalize font-extrabold">
                {video?.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-muted-foreground/80 flex  items-center gap-x-2 text-sm">
                  <FaEye className="text-md" /> {video?.views}
                </p>
                {author && (
                  <>
                    <EditVideo
                      videoId={videoId}
                      title={video.title as string}
                      description={video.description as string}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-transparent  relative aspect-video  rounded-lg">
              <div className="absolute w-full h-full z-0">
                <video
                  muted
                  ref={VideoRef}
                  preload="metadata"
                  className="w-full    h-full  opacity-50 blur-2xl    rounded-xl"
                  controls={false}
                  src={src}
                />
              </div>

              <VideoPlayer
                thumbnail={video?.thumbnail}
                title={video?.title || ""}
                fn={fn}
                video={src}
                duration={video?.duration}
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
              <div className="flex items-center gap-x-3">
                <ButtonGroup size="md" variant="flat" isIconOnly>
                  <CopyLink videoId={videoId} size="md" />

                  <Tooltip placement="bottom" content="Download">
                    <Button>
                      <MdDownloading className="text-md" />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
                <RichLink
                  title={video?.title as string}
                  id={videoId}
                  source={video?.source as string}
                  description={truncateString(video?.description as string)}
                />
              </div>
            </div>

            <div className="flex flex-col bg-muted-foreground/5 p-4 rounded-lg text-2xl gap-y-2">
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
        <div className="xl:px-7">
          <TabMenu
            defaultTab="Ai Tools"
            triggers={["Ai Tools", "Transcript", "Activity"]}
          >
            <section className="py-5 w-full">
              <AiTools plan="PRO" trial={false} videoId={videoId} />
              <VideoTranscript transcript={video?.description as string} />
              <Activities
                videoId={videoId}
                author={video?.User?.firstname as string}
              />
            </section>
          </TabMenu>
        </div>
      </div>
    )
  );
};

export default VideoPreview;
