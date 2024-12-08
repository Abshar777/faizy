"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { PiSealWarningDuotone, PiSealWarningFill } from "react-icons/pi";
import { getAllUserVideos } from "../../../../actions/workspace";
import { VideosProps } from "@/types/index.type";
import { ArrowRight, SortDescIcon } from "lucide-react";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { cn } from "@/lib/utils";
import VideoCard from "./VideoCard";

interface Props {
  folderId: string;
  workspaceId: string;
  videosKey: string;
}

const Videos = ({ folderId, workspaceId, videosKey }: Props) => {
  const { data: videoData } = useQueryData([videosKey], () =>
    getAllUserVideos(folderId)
  );
  const { status: videoStatus, data: videos } = videoData as VideosProps;
  console.log(videoStatus);
  
  return (
    <div className="flex w-full flex-col gap-4 mt-4">
      <div className="flex  w-full  items-center justify-between">
        <div className="heading px-1 flex w-full items-center gap-2">
          <VideoRecorderDuotone />{" "}
          <h2 className="text-lg text-muted-foreground font-semibold ">
            Videos
          </h2>
        </div>
        <div className="flex cursor-pointer group  items-center gap-1 mt-1">
          <p className="transition-all duration-[.3] ease-in  text-sm opacity-50 group-hover:opacity-100">
            Sort
          </p>
          <SortDescIcon
            className="transition-all duration-[.3] ease-in group-hover:translate-y-0.5 translate-y-0 text-xs group-hover:text-primary opacity-50 group-hover:opacity-100"
            size={20}
          />
        </div>
      </div>
      <section
        className={
          cn(videoStatus != 200
            ? "p-5 w-full flex justify-center "
            : "grid  grid-cols-2  gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 ")
        }
      >
        {videoStatus !== 200 ? (
          <p className="text-sm text-muted-foreground  flex flex-1  items-center justify-center gap-x-2">
            <PiSealWarningDuotone className="text-muted-foreground \" />
            No videos found
          </p>
        ) : (
          videos.map((video) => (
            <VideoCard workspaceId={workspaceId} key={video.id} {...video} />
          ))
        )}
      </section>
    </div>
  );
};

export default Videos;
