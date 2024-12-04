"use client";
import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Tooltip } from "@nextui-org/tooltip";
import { Search, UploadIcon } from "lucide-react";
import React from "react";

type Props = {};

const InfoBar = (props: Props) => {
  return (
    <header className="pl-20 md:pl-[265px] fixed py-4 px-3 -ml-2 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search size={25} className="text-muted-foreground/50" />
        <Input
          className="bg-transparent outline-none ring-0 ring-transparent outline-0 outline-transparent border-none !placeholder-muted-foreground/50"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-4">
        <Tooltip
          content="Upload"
          color="secondary"
          showArrow
          placement="bottom"
          classNames={{ arrow: "rounded-none" }}
        >
          <Button className="bg-muted-foreground flex items-center gap-2">
            <UploadIcon size={20} />{" "}
            <span className="flex items-center gap-2">Upload</span>
          </Button>
        </Tooltip>
        <Tooltip
          content="Record"
          color="secondary"
          showArrow
          placement="bottom"
          classNames={{ arrow: "rounded-none" }}
        >
          <Button className="bg-muted-foreground md:flex hidden  items-center gap-2">
            <VideoRecorderIcon />
            <span className="flex items-center gap-2">Record</span>
          </Button>
        </Tooltip>
        <UserButton />
      </div>
    </header>
  );
};

export default InfoBar;
