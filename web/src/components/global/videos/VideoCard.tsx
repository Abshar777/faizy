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
import { Dot, Share2 } from "lucide-react";
import { CopyLink } from "./copyLink";
import Link from "next/link";

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
  thumbnail: string;
}

const VideoCard = (props: Props) => {
  const { ripples, onClick, onClear } = useRipple();

  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(props.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  let src = props.source;
  let stremUrl =
    process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL ||
    "https://d3m6ajsnw89gp6.cloudfront.net";

  if (props.title !== "Source Fight" && props.title !== "Agenet Fight") {
    src = `${stremUrl}/${props.source}#1`;
  }
  const [load, setload] = useState(true)

  useEffect(()=>{
    (async()=>{
     try{
      const response=await fetch(src, { mode: 'no-cors' })
      setload(false);
     }catch(err){
      console.log(err);
      
     }
    })() 
  },[])

  return (
    <Card
      shadow="sm"
      key={1}
      className=" hover:bg-muted-foreground/20 group relative bg-muted-foreground/5 cursor-pointer transition duration-150  justify-between  items-center gap-2"
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
        </div>
        <div className="absolute z-50 bottom-3 left-3">
          <CopyLink videoId={props.id} />
        </div>
        <Link href={`/dashboard/${props.workspaceId}/video/${props.id}`}>
        {
          (props.thumbnail||load)?(
            <Image
            isBlurred={!load}
            shadow="lg"
            radius="lg"
            width="100%"
            className="w-full  object-cover h-[140px] "
            src={props.thumbnail}
            alt=""
          />
          ):(
            <div className="relative">
              <video className="w-full absolute z-[0] opacity-[25] blur-xl  object-cover h-[140px] rounded-xl" src={src} muted controls={false}/>
              <video className="w-full  object-cover relative z-[1] h-[140px] rounded-xl" src={src} muted controls={false}/>
            </div>
          )
        }
        </Link>
      </CardBody>
      <CardFooter className="  flex flex-col items-start pt-1  px-3 z-20">
        <Link className="w-full" href={`/dashboard/${props.workspaceId}/video/${props.id}`}>
          <h2 className="text-sm capitalize  font-semibold text-[#BDBDBD]">
            {props.title}
          </h2>
          <div className="flex gap-x-2 items-center mt-1 ">
            <Avatar className=" w-8 h-8 flex items-center justify-center ">
              <AvatarImage src={props.User?.image as string} />
              <AvatarFallback className="bg-muted-foreground/5 capitalize">
                {props.User?.firstname?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-0">
              <p className="capitalize tracking-tighter text-xs text-[#BDBDBD]">
                {props.User?.firstname} {props.User?.lastname}
              </p>
              <p className="text-[#6d6b6b] -mt-1  text-xs flex items-center   ">
                <Dot className="-ml-2" />{" "}
                <span className="-ml-1">
                  {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </span>
              </p>
            </div>
          </div>
        </Link>
        <div className="flex gap-x items-center -ml-2">
          <Button
            size="sm"
            isIconOnly
            className="p-1 rounded-full "
            variant="light"
          >
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
