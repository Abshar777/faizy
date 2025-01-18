import { cn } from "@/lib/utils";
import {
  onStopRecording,
  selectSource,
  startPreview,
  startRecording,
  stopRecording,
  TOnSource,
  videoRecordTime,
} from "@/util/recorder";
import { hidePluginWindow } from "@/util/windows";
import { useUser } from "@clerk/clerk-react";
import { Cast, Pause } from "lucide-react";
import { useEffect, useState } from "react";
import { PiSealWarningDuotone } from "react-icons/pi";

interface Props {}

const Studio_app = (props: Props) => {
  let initialTime = new Date();
  const [timer, settimer] = useState("00:00:00");
  const [cast, setcast] = useState(false);
  const [recording, setRecording] = useState(false);
  const [onSource, setonSource] = useState<TOnSource | undefined>(undefined);
  const [count, setcount] = useState(0);
  useEffect(() => {
    window.ipcRenderer.on("profile-recieved", (event, payload) => {
      setonSource(payload);
    });
  });

  const clearTime = () => {
    setcount(0);
    settimer("00:00:00");
  };

  useEffect(() => {
    if (!recording) return;
    const intervalId = setInterval(() => {
      const elapsed = count + (new Date().getTime() - initialTime.getTime());
      setcount(elapsed);
      const recordingTime = videoRecordTime(elapsed);
      if (onSource?.plan === "FREE" && recordingTime.minute === "05") {
        setRecording(false);
        clearTime();
        onStopRecording();
      }
      settimer(recordingTime.length);
    }, 1000); // Use 1000ms (1s) to avoid performance issues

    return () => clearInterval(intervalId); // Cleanup
  }, [recording]);

  const { user } = useUser();
  useEffect(() => {
    if ( onSource && onSource.screen && user) {
      selectSource(onSource, user.id)
      
    }
    return () => {
      selectSource(null, null);
    };
  }, [ onSource, user]);

  useEffect(() => {
    hidePluginWindow(recording);
  }, [recording]);

  return onSource ? (
    <div className="w-full  draggable h-screen flex items-center justify-between p-2">
      <div
        {...(onSource && {
          onClick: async () => {
            if (!recording && user) {
              // setTimeout(()=>{
               setRecording(true);
                startRecording(onSource)
            //  },1000)
            } else {
              clearTime();
              onStopRecording();
              setRecording(false);
              startPreview(false);
              setcast(false);
            }
          },
        })}
        className={cn(
          " duration-[.2] ease-in cursor-pointer   no-draggable  w-[1.5rem] h-[1.5rem] bg-red-900",
          recording ? "animate-pulse   rounded-sm" : "rounded-full"
        )}
      />
      {recording && <span className="">{timer}</span>}
      {recording && (
        <div className="no-draggable cursor-pointer ">
          <Pause
            className="hover:fill-foreground-700/50  no-draggable fill-foreground-900"
            fill="#3e3d3d"
            stroke="none"
          />
        </div>
      )}
      <Cast
        {...(cast && {
          fill: "gray",
        })}
        className="no-draggable cursor-pointer"
        onClick={() => {
          startPreview(!cast);
          setcast(!cast);
        }}
      />
    </div>
  ) : (
    <div className="w-full draggable h-screen flex items-center justify-center ">
      <p className="text-sm text-muted-foreground  flex flex-1  items-center justify-center gap-x-2">
        <PiSealWarningDuotone className="text-muted-foreground \" />
        No Source found
      </p>
    </div>
  );
};

export default Studio_app;
