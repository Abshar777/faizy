import { hidePluginWindow } from "./windows";
import { v4 as uuid } from "uuid";
import { io } from "socket.io-client"
import { getProfile } from "@/api/auth";
import { useUser } from "@clerk/clerk-react";



export type TOnSource = {
    screen: string;
    id: string;
    audio: string;
    prest: "HD" | "SD";
    plan: "PRO" | "FREE";
}
let mediaRecorder: MediaRecorder;
let videoTransferFileName: string | undefined;
let userId: string;


// socket 
const socket = io(import.meta.env.VITE_SOCKET_URL as string);



export const startRecording = (onSource: TOnSource) => {
    hidePluginWindow(true);
    videoTransferFileName = `${uuid()}.webm`
    mediaRecorder.start(100)
}

export const onDataAvailable = (e: BlobEvent) => {
    socket.emit("video-chunks", {
        chunks: e.data,
        fileName: videoTransferFileName
    })
}


export const onStopRecording = () => mediaRecorder.stop();

export const stopRecording = () => {
    // hidePluginWindow(false);
    socket.emit("process-video", {
        fileName: videoTransferFileName,
        userId
    })
}

export const videoRecordTime = (ms: number) => {
    const second = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, "0");
    const hour = Math.floor((ms / 1000 / 60 / 60)).toString().padStart(2, "0");
    return { length: `${hour}:${minute}:${second}`, minute }
}


export const selectSource = async (onSource: TOnSource,userID:string) => {
    if (onSource && onSource.screen && onSource.audio) {
        userId=userId;
        const constrains: any = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: onSource?.screen,
                    minWidth: onSource.prest == "HD" ? 1920 : 1280,
                    maxWidth: onSource.prest == "HD" ? 1920 : 1280,
                    minHeight: onSource.prest == "HD" ? 1080 : 720,
                    maxHeight: onSource.prest == "HD" ? 1080 : 720,
                    framerate: 30,
                }
            }
        }
      
        const stream = await navigator.mediaDevices.getUserMedia(constrains);
        const audioStreame = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: onSource?.audio ? { deviceId: { exact: onSource.audio } } : false,

        })
        // console.log(stream,"streeeeeem")
        window.ipcRenderer.send("play-video", { constrains })

        const combineStream = new MediaStream([...stream.getTracks(), ...audioStreame.getTracks()]);
        mediaRecorder = new MediaRecorder(combineStream, {
            mimeType: "video/webm; codecs=vp9",
        })
        // console.log(mediaRecorder, "media recorder")
        mediaRecorder.ondataavailable = onDataAvailable
        mediaRecorder.onstart = stopRecording
    }
}

export const startPreview = (state: boolean) => {
    // console.log("startPreview",state)
    window.ipcRenderer.send("startPreview", { state })
}