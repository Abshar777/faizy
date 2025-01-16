import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface Props {}

const WebCam_app = (props: Props) => {
  const [preview, setpreview] = useState(false);
  const videoElement = useRef<HTMLVideoElement>(null);
  return (
    <div className="w-full h-screen flex flex-col justify-end gap-y-5  draggable ">
      <video
        autoPlay
        ref={videoElement}
        className={cn("w-6/12 border-2 self-end ", preview && "hidden")}
      />
    </div>
  );
};

export default WebCam_app;
