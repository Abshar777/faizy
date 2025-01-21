
import { v4 as uuid } from "uuid";
import { io } from "socket.io-client"
import { RefObject } from "react";
import { toast } from "sonner";



export type TOnSource = {
    screen: string;
    id: string;
    audio: string;
    prest: "HD" | "SD";
    plan: "PRO" | "FREE";
}
let mediaRecorder: MediaRecorder | null;
let videoTransferFileName: string | undefined;
let userId: string;
let isRecording = false;
let audioRecorder: MediaRecorder | null;
let stream: MediaStream | null;
let audioStream: MediaStream | null;


// socket 
const socket = io("http://localhost:3001", { transports: ["websocket", "polling"] });



export const startRecording = () => {
    console.log("called");
    if (!mediaRecorder || !audioRecorder) {
        console.log("media recorder not found", mediaRecorder, audioRecorder)
        toast.error("Please select a source to start recording");
        return false;
    };
    isRecording = true;
    videoTransferFileName = `${uuid()}.webm`;
    mediaRecorder.start(100);
    audioRecorder.start(100);
    return true;
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


export const onAudioDataAvailable = (e: BlobEvent, micState: boolean) => {
    // alert("running")
    // console.log("on audio avaible ");

    if (isRecording && micState) {
        // console.log("runnigg auido")
        socket.emit("auido-chunks", {
            chunks: e.data,
            fileName: videoTransferFileName?.split(".")[0] + ".mp3",
        })
    }
}


export const onStopRecording = () => {
    if (!mediaRecorder || !audioRecorder) return;
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
    toast.success("Video is processing, you will be notified once it's done")

}

export const stopAuidoRecording = () => {
    // hidePluginWindow(false);
    console.log("proccesss audio");

    socket.emit("process-audio", {
        fileName: videoTransferFileName?.split(".")[0] + ".mp3",
        userId
    })


}

export const videoRecordTime = (ms: number) => {
    const second = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, "0");
    const hour = Math.floor((ms / 1000 / 60 / 60)).toString().padStart(2, "0");
    return { length: `${hour}:${minute}:${second}`, minute }
}


export const selectSource = async (audio: string, userID: string | null, videoRef: RefObject<HTMLVideoElement>, micState: boolean, onEndFn?: Function) => {
    if (!userID) return
    userId = userID;

    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            // audio: micState ? { deviceId: { exact: audio } } : false
        });
        stream.getVideoTracks()[0].onended = () => {
            if (onEndFn) onEndFn()
            if (mediaRecorder?.state === 'recording') {
                onStopRecording();
            }
            deselectSource(videoRef);
        }
        if (videoRef.current) videoRef.current.srcObject = stream;
        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: audio ? { deviceId: { exact: audio } } : true,
        })

        const combineTracks = [...stream.getTracks()]
        if (micState) combineTracks.push(...audioStream.getTracks())
        const combineStream = new MediaStream(combineTracks);
        mediaRecorder = new MediaRecorder(combineStream, {
            mimeType: "video/webm; codecs=vp9",
        })
        audioRecorder = new MediaRecorder(audioStream, {
            mimeType: "audio/webm",
        });
        mediaRecorder.ondataavailable = onDataAvailable
        mediaRecorder.onstop = () => {
            if (!stream) return;
            stream.getTracks().forEach((track) => track.stop());
           if(videoRef.current) videoRef.current.srcObject=null;
            stopRecording()
        };
        audioRecorder.ondataavailable = (e) => {
            onAudioDataAvailable(e, micState)
        };
        audioRecorder.onstop = () => {
            if (!audioStream) return;
            audioStream.getTracks().forEach((track) => track.stop());
            stopAuidoRecording();

        }
        return true;
    } catch (error) {
        console.log("Error accessing the camera:", error);
        if (videoRef.current) videoRef.current.srcObject = null;
        return false;
    }
}

export const deselectSource = (videoref: RefObject<HTMLVideoElement>) => {
    if (!mediaRecorder || !audioRecorder) return;
    if (videoref.current) videoref.current.srcObject = null;
    mediaRecorder.stop();
    audioRecorder.stop();
    mediaRecorder = null;
    audioRecorder = null;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
}


export const openPopup = () => {

    const studioWindow = window.open(
        "",
        "studioWindow",
        "width=300,height=200,minWidth=300,maxWidth=300,minHeight=200,maxHeight=200,top=100,left=100,resizable=no,scrollbars=no,status=no"
    );




    setTimeout(() => {
        if (studioWindow) {
            console.log(outerHeight)
            studioWindow.outerHeight > 200 && studioWindow.close();
        }
    }, 1000)
    if (studioWindow) {
        studioWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Studio Tray</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              background-color: #f0f0f0;
              scrollbar-width: 0;
            }
           
            ::-webkit-scrollbar {
              width: 0; /* For Chrome, Safari, and Opera */
              height: 0; /* For Chrome, Safari, and Opera */
            }
            video {
              width: 100%;
             height: 100%;
            object-fit: cover;
            }
           
          </style>
        </head>
        <body>
          <video id="camera" autoplay playsinline></video>
          <script>
            async function initCamera() {
              try {
                const videoElement = document.getElementById('camera');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoElement.srcObject = stream;
              } catch (error) {
                console.error('Error accessing the camera:', error);
                alert('Unable to access the camera. Please allow camera access.');
              }
            }
            initCamera();
          </script>
        </body>
        </html>
      `);

        studioWindow.document.close();
    } else {
        alert("Popup blocked! Please allow popups for this site.");
    }
};