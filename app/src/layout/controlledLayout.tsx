import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { X } from "lucide-react";
import { onCloseApp } from "../lib/utils";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import AuthButton from "@/components/global/authButton";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const ControlledLayout = ({ children, className }: Props) => {
  const { user } = useUser();
  const [videoState, setvideoState] = useState(false);
  const videoElement = useRef<HTMLVideoElement>(null);
  const [visible, setvisible] = useState(false);
  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    setvisible(payload.state);
  });
  window.ipcRenderer.on("play-video", async (event, payload) => {
    if (videoElement && videoElement.current) {
      const stream=await navigator.mediaDevices.getUserMedia(payload.constrains);
      
      videoElement.current.srcObject =stream
        
      await videoElement.current.play();
    }
  });

  window.ipcRenderer.on("startPreview", (event, {payload}) => {
    // console.log("previwe on main");
    setvideoState(payload.state);
  });

  useEffect(()=>{
    console.log("changed state",videoState)
  },[videoState])

  return (
    <div
      className={cn(
        className,
        " flex px-1 bg-primary rounded-xl relative   flex-col  overflow-hidden h-screen"
      )}
    >
      <div className="flex justify-between items-center px-5  ">
        <span className="non-draggable">
          {user ? <UserButton /> : <AuthButton />}
        </span>
        <div className=" draggable  w-full flex justify-center items-center">
          <Image src="/Faizy.svg" alt="Faizy" width={70} height={70} />
        </div>
        <Button
          isIconOnly
          variant="solid"
          className="hover:bg-transparent bg-transparent"
          onClick={onCloseApp}
        >
          <X className="cursor-pointer" onClick={onCloseApp} />
        </Button>
      </div>
      {!visible&&!videoState && children}

      <video
        autoPlay
        ref={videoElement}
        className={cn("w-full  rounded-md h-full hidden object-cover",videoState&&"block")}
      />
      
      {visible && !videoState && (
        <>
          <div className="w-full h-full flex items-center justify-center">
            <h1>recording..</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default ControlledLayout;
