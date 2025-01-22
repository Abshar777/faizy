import express from "express"
import { config } from "dotenv";
import router from "./router/router";
import cors from "cors";
import { Server } from "socket.io"
import http from "http"
import { socketHandle } from "./controller/controller";
config();

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/", router);

const origin = process.env.ELECTRON_HOST;

// socket set upp
const io = new Server(server, {
    cors: {
        origin,
        methods: ['GET', "POST"]
    }
})

io.on("connection", (socket) => {
    const socketHandler = new socketHandle();
    console.log("🟡 socket is connected ");

    socket.on("video-chunks", socketHandler.handleVideoChunks.bind(socketHandler))

    socket.on("auido-chunks", socketHandler.handleAudioChunks.bind(socketHandler))

    socket.on("process-video", socketHandler.handleProcessingOfVideo.bind(socketHandler))

    socket.on("process-audio", socketHandler.handleProccesingAudioFile.bind(socketHandler))

    socket.on("disconnect", async (data) => {
        console.log("⚫ socket is disconnetd ", data);
    })

})

io.on("connect_error", (error) => {
    console.error("Socket connection error 🔴", error.message);
});

server.listen(port, () => {
    console.log("server runing on port :", port);
})