import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface Props {}

const WebCam_app = (props: Props) => {
  const camElment = useRef<HTMLVideoElement>(null);
  const streamCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (camElment.current) {
      camElment.current.srcObject = stream;
      await camElment.current.play();
    }
  };
  useEffect(() => {
    streamCam();
  }, []);
  return (
    <div className="h-screen w-full">
      <video
        ref={camElment}
        className="h-full scale-x-[-1] w-full draggable rounded-lg object-cover border-2 relative border-white"
      ></video>
    </div>
  );
};

export default WebCam_app;
