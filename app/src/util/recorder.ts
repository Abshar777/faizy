import { hidePluginWindow } from "./windows";
import { v4 as uuid } from "uuid";
import { io } from "socket.io-client"



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
let isRecording = false;
let audioRecorder: MediaRecorder;


// socket 
const socket = io("http://localhost:3001", { transports: ["websocket", "polling"] });



export const startRecording = (onSource: TOnSource) => {
    console.log("called");

    isRecording = true;
    hidePluginWindow(true);
    videoTransferFileName = `${uuid()}.webm`;
    mediaRecorder.start(100);
    audioRecorder.start(100);
}

export const onDataAvailable = (e: BlobEvent) => {

    if (isRecording) {
        // console.log("runnigg")
        socket.emit("video-chunks", {
            chunks: e.data,
            fileName: videoTransferFileName,
        })
    }
}


export const onAudioDataAvailable = (e: BlobEvent) => {
    // alert("running")
    // console.log("on audio avaible ");

    if (isRecording) {
        // console.log("runnigg auido")
        socket.emit("auido-chunks", {
            chunks: e.data,
            fileName: videoTransferFileName?.split(".")[0]+".mp3",
        })
    }
}


export const onStopRecording = () => {
    isRecording = false;
    mediaRecorder.stop();
    audioRecorder.stop();
}

export const stopRecording = () => {
    // hidePluginWindow(false);
    console.log("proccesss video");

    socket.emit("process-video", {
        fileName: videoTransferFileName,
        userId
    })

}

export const stopAuidoRecording = () => {
    // hidePluginWindow(false);
    console.log("proccesss audio");

    socket.emit("process-audio", {
        fileName:videoTransferFileName?.split(".")[0]+".mp3" ,
        userId
    })

}

export const videoRecordTime = (ms: number) => {
    const second = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, "0");
    const hour = Math.floor((ms / 1000 / 60 / 60)).toString().padStart(2, "0");
    return { length: `${hour}:${minute}:${second}`, minute }
}


export const selectSource = async (onSource: TOnSource | null, userID: string | null) => {
    if (!userID) return
    if (onSource && onSource.screen && onSource.audio) {
        userId = userID;
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
        audioRecorder = new MediaRecorder(audioStreame, {
            mimeType: "audio/webm",
        });
        // console.log(mediaRecorder, "media recorder")
        mediaRecorder.ondataavailable = onDataAvailable
        mediaRecorder.onstop = stopRecording;
        audioRecorder.ondataavailable = onAudioDataAvailable;
        audioRecorder.onstop= stopAuidoRecording
    }
}

export const startPreview = (state: boolean) => {
    // console.log("startPreview",state)
    window.ipcRenderer.send("startPreview", { state })
}