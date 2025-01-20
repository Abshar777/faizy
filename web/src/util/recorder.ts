
import { v4 as uuid } from "uuid";
import { io } from "socket.io-client"
import { RefObject } from "react";



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



export const startRecording = () => {
    console.log("called");
    if(!mediaRecorder) return;
    isRecording = true;
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


export const selectSource = async (audio:string, userID: string | null,videoRef:RefObject<HTMLVideoElement>) => {
    if (!userID) return
    userId = userID;
    
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video:true,
        audio:true
    });
   if(videoRef.current) videoRef.current.srcObject = stream;
    const audioStreame = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: audio? { deviceId: { exact:audio } } : false,
    })

    const combineStream = new MediaStream([...stream.getTracks(), ...audioStreame.getTracks()]);
    mediaRecorder = new MediaRecorder(combineStream, {
        mimeType: "video/webm; codecs=vp9",
    })
    stream.getVideoTracks()[0].onended = () => {    
        mediaRecorder.stop();
        audioRecorder.stop();
    }
    audioRecorder = new MediaRecorder(audioStreame, {
        mimeType: "audio/webm",
    });
    // console.log(mediaRecorder, "media recorder")
    mediaRecorder.ondataavailable = onDataAvailable
    mediaRecorder.onstop = stopRecording;
    audioRecorder.ondataavailable = onAudioDataAvailable;
    audioRecorder.onstop= stopAuidoRecording
}

