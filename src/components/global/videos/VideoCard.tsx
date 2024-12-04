"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Ripple,
  useRipple,
} from "@nextui-org/react";

import VideoCardMenu from "./VideoCardMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Share2, User } from "lucide-react";

interface Props {
  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  } | null;
  id: string;
  processing: boolean;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
  workspaceId: string;
}

const VideoCard = (props: Props) => {
  const { ripples, onClick, onClear } = useRipple();
  const [thumbnail, setThumbnail] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const generateThumbnail = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 2; // Seek to 2 seconds
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // console.log(context,canvas);
        // const dataUrl = canvas.toDataURL("image/png");
        // setThumbnail(dataUrl);
      }
    };
  };
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(props.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    generateThumbnail();
  }, []);

  return (
    <Card
      shadow="sm"
      key={1}
      className=" hover:bg-muted-foreground/20 group relative bg-muted-foreground/5 cursor-pointer transition duration-150  justify-between  items-center gap-2"
      onPress={() => console.log("item pressed")}
      onMouseDown={onClick}
    >
      <Ripple onClear={onClear} ripples={ripples} />
      <CardBody className="overflow-visible relative p-[.3rem]">
        <div className="absolute top-3 right-3  z-50  gap-x-3 flex">
          <VideoCardMenu
            currentFolderName={props.Folder?.name || ""}
            videoId={props.id}
            currentWorkspace={props.workspaceId || ""}
            currentFolder={props.Folder?.id || ""}
          />
          {/* 
          <CopyLink
            className="p-[5px] h-5 bg-hover:bg-transparent bg-[#252525]"
            videoId={props.id}
          /> */}
        </div>
        <Image
          isLoading
          isBlurred
          shadow="sm"
          radius="lg"
          width="100%"
          className="w-full object-cover h-[140px] "
          src={props.source}
          alt=""
        />
        <video
          ref={videoRef}
          controls={false}
          preload="metadata"
          className="w-full hidden  aspect-video opacity-50 z-20"
        >
          <source src={props.source} />
        </video>
      </CardBody>
      <CardFooter className="  flex flex-col items-start pt-1  px-3 z-20">
        <h2 className="text-sm  font-semibold text-[#BDBDBD]">{props.title}</h2>
        <div className="flex gap-x-2 items-center mt-1 ">
          <Avatar className=" w-8 h-8 flex items-center justify-center ">
            <AvatarImage src={props.User?.image as string} />
            <AvatarFallback className="bg-muted-foreground/5 capitalize">
              {props.User?.firstname?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="capitalize text-xs text-[#BDBDBD]">
              {props.User?.firstname} {props.User?.lastname}
            </p>
            <p className="text-[#6d6b6b]  text-xs flex items-center   ">
              <Dot className="-ml-2" />{" "}
              <span className="-ml-1">
                {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-x items-center ">
          <Button size="sm" isIconOnly className="p-1 rounded-full " variant="light">
            <Share2 fill="#9D9D9D" className="text-[#9D9D9D]" size={12} />
          </Button>
          <p className="text-xs text-[#9D9D9D] capitalize">
            {props.User?.firstname}'s Workspace
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
