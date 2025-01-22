"use client";

import { Button } from "@nextui-org/button";
import { useEffect, useRef, useState } from "react";
import { LuCamera, LuCameraOff } from "react-icons/lu";
import { RiMicFill, RiMicOffFill } from "react-icons/ri";
import { MdScreenShare } from "react-icons/md";
import { MdOutlineScreenShare } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import {
  deselectSource,
  onStopRecording,
  openPopup,
  selectSource,
  startRecording,
  stopRecording,
  videoRecordTime,
} from "@/util/recorder";

interface Props {}

const Page = (props: Props) => {
  let initialTime = new Date();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [cameraState, setCameraState] = useState<boolean>(false);
  const [micState, setMicState] = useState<boolean>(true);
  const [screenState, setScreenState] = useState<boolean>(false);
  const [record, setrecord] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [count, setcount] = useState(0);
  // const [availableMicDevices, setAvailableMicDevices] = useState<
  //   MediaDeviceInfo[]
  // >([]);
  const [selectMic, setSelectMic] = useState("default");
  const { user } = useUser();
  const [timer, settimer] = useState("00:00:00");
  const clearTime = () => {
    setcount(0);
    settimer("00:00:00");
  };

  useEffect(() => {
    if (!record) return;
    const intervalId = setInterval(() => {
      const elapsed = count + (new Date().getTime() - initialTime.getTime());
      setcount(elapsed);
      const recordingTime = videoRecordTime(elapsed);
      settimer(recordingTime.length);
    }, 1000); // Use 1000ms (1s) to avoid performance issues

    return () => clearInterval(intervalId); // Cleanup
  }, [record]);

  const onEndFn = () => {
    console.log("jabajbababjb");
    setScreenState(!screenState);
    setrecord(false);
    clearTime()
    if (btnRef.current) btnRef.current.click();
  };

  // useEffect(() => {
  //   const fetchMicDevices = async () => {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const micDevices = devices.filter(
  //       (device) => device.kind === "audioinput"
  //     );
  //     setAvailableMicDevices(micDevices);
  //   };

  //   fetchMicDevices();
  // }, []);

  const toggleCamera = async () => {
    if (cameraState) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        openPopup();
        if (cameraRef.current) cameraRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    } else {
      if (cameraRef.current?.srcObject) {
        const tracks = (cameraRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        cameraRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    toggleCamera();
  }, [cameraState]);
  useEffect(() => {
    if (btnRef.current) btnRef.current.click();
  }, []);
  useEffect(() => {
    if (screenState && user?.id) {
      selectSource(selectMic, user?.id as string, videoRef, micState, onEndFn);
    }
  }, [micState, selectMic]);

  const handleScreenShare = async () => {
    if (screenState && user?.id) {
      const selected = await selectSource(
        selectMic,
        user?.id as string,
        videoRef,
        micState,
        onEndFn
      );
      console.log(selected);
      if (selected) setScreenState(false);
    } else {
      deselectSource(videoRef);
      setScreenState(true);

    }
  };
  useEffect(() => {
    if(!record) clearTime()
  }, [record]);

  return (
    <div className="w-full flex flex-col gap-1 h-[80vh] mt-2 p-2">
      <div className="w-full h-[80%] p-2 relative flex items-center justify-center aspect-video overflow-hidden rounded-lg">
        <div className="absolute z-[0] w-full bg-background/20 h-full"></div>
        <video
          ref={videoRef}
          autoPlay
          controls={false}
          muted
          className="relative z-0 h-full object-cover"
        />
        <div
          className={cn(
            "rounded-full overflow-hidden h-[8rem] w-[8rem] border-1 border-white/40 absolute bottom-[2%] right-0",
            !cameraState ? "hidden" : "block"
          )}
        >
          <video
            ref={cameraRef}
            autoPlay
            controls={false}
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex w-full items-start flex-1 justify-center">
        <div className="flex gap-2 rounded-full bg-background/50 px-7 py-2 mt-2 items-center justify-center">
          <Button
            ref={btnRef}
            onClick={handleScreenShare}
            radius="full"
            className="bg-background/60"
            isIconOnly
          >
            {screenState ? (
              <MdScreenShare className="text-lg" />
            ) : (
              <MdOutlineScreenShare className="text-lg" />
            )}
          </Button>
        

          <Button
            onClick={
              record
                ? () => {
                    onStopRecording();
                    setrecord(false);
                  }
                : () => {
                    const start = startRecording();
                    setrecord(start);
                  }
            }
            radius="full"
            className="bg-background/60"
            isIconOnly
          >
            <div
              className={`w-4 h-4 rounded-full ${
                record ? "bg-red-900" : "bg-green-900"
              }`}
            ></div>
          </Button>
          <div className="bg-background/60 px-4 rounded-lg py-1" >
            <p className="text-sm">{timer}</p>
          </div>
          <Button
            onClick={() => setCameraState(!cameraState)}
            radius="full"
            className="bg-background/60"
            isIconOnly
          >
            {cameraState ? (
              <LuCamera className="text-lg" />
            ) : (
              <LuCameraOff className="text-lg" />
            )}
          </Button>
          {/* ---------------------------------mic------------------------------ */}
          
          {/* <div className="relative">
            <Select onValueChange={(value) => setSelectMic(value)}>
              <SelectTrigger className="bg-background/90 outline-none outline-0 text-sm scale-[.7] ring-0 ring-transparent absolute left-[63%] top-[11%] z-[1] border-0 rounded-full"></SelectTrigger>
              <SelectContent className="outline-0 bg-background/20 backdrop-blur-xl">
                <SelectGroup>
                  <SelectLabel>Select Microphone</SelectLabel>
                  <Separator />
                  {availableMicDevices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setMicState(!micState)}
              radius="full"
              className="bg-background/60 "
              isIconOnly
            >
              {micState ? (
                <RiMicFill className="text-lg" />
              ) : (
                <RiMicOffFill className="text-lg" />
              )}
            </Button>
          </div> */}
          {/* ------------------------------mic----------------------------- */}
        </div>
      </div>
    </div>
  );
};

export default Page;
