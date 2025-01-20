
import fs from "fs"
import { TDataFromSocket, TprocessVideo } from "../types/index.type";
import { Readable } from "stream"
import path from "path";
import axios from "axios";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client";
import { TEMPDIR } from "../constants";
import { createTranscription } from "../helper/transcription";
import { getThumbnail } from "../helper/thumbnail";
import { Request, Response } from "express";




export class socketHandle {
    private recorderdChunks: Blob[];
    private audioRecorderdedChunks: Blob[];
    private duration: number;
    constructor() {
        this.recorderdChunks = [];
        this.audioRecorderdedChunks = [];
        this.duration = 0;
    }
    async handleVideoChunks(data: TDataFromSocket) {
        if (!fs.existsSync(TEMPDIR)) {
            fs.mkdirSync(TEMPDIR, { recursive: true });
        }
        const writeStream = fs.createWriteStream(path.join(TEMPDIR + '/video', data.fileName));
        this.recorderdChunks.push(data.chunks);
        const videoBlob = new Blob(this.recorderdChunks, {
            type: "video/webm; codecs=vp9",
        })
        this.duration += 1;
        const buffer = Buffer.from(await videoBlob.arrayBuffer());
        const readStream = Readable.from(buffer);
        readStream.pipe(writeStream).on("finish", () => {
            console.log("⚪ chunk saved", this.duration)
        })
    }

    async handleAudioChunks(data: TDataFromSocket) {
        if (!fs.existsSync(TEMPDIR)) {
            fs.mkdirSync(TEMPDIR, { recursive: true });
        }
        const writeStream = fs.createWriteStream(path.join(TEMPDIR + '/audio', data.fileName));
        this.audioRecorderdedChunks.push(data.chunks);
        const audioBlob = new Blob(this.audioRecorderdedChunks, {
            type: "audio/webm",
        })
        const buffer = Buffer.from(await audioBlob.arrayBuffer());
        const readStream = Readable.from(buffer);
        readStream.pipe(writeStream).on("finish", () => {
            console.log("⚪ audio chunk saved")
        })
    }

    async handleProccesingAudioFile(data: TprocessVideo) {
        try {

            console.log("🟠 proccesing audio started")
            this.audioRecorderdedChunks = [];
            const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`, {
                fileName: data.fileName.split(".")[0] + ".webm"
            });

            if (processing.data.plan == "PRO") await createTranscription(data.fileName, data.userId);
            else {
                fs.unlinkSync(path.join(TEMPDIR + "/audio/", data.fileName));
                console.log("he is not pro 🔵,audio file dlted succefully 🟢");
            }

        } catch (error) {
            console.log((error as Error).message, "🔴 post to next api, when proccesing the audio file")
        }
    }




    async handleProcessingOfVideo(data: TprocessVideo) {
        console.log("🟠 processing video.. ", data);
        this.recorderdChunks = [];
        fs.readFile(path.join(TEMPDIR + '/video/', data.fileName), async (err, file) => {
            try {
                if (err) return console.log("🔴 error on when reading that video file ", err.message)
                const Key = data.fileName;
                const Bucket = process.env.BUCKET_NAME;
                const ContentType = "video/webm";
                const Command = new PutObjectCommand({
                    Key,
                    Bucket,
                    ContentType,
                    Body: file
                })

                const fileStatus = await s3.send(Command)

                if (fileStatus['$metadata'].httpStatusCode === 200) console.log("🟢 succesfully video upload to s3 bucket");
                else console.log("🔴 error on uploading to s3")
                const stopProcessing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/complete`, {
                    fileName: data.fileName,
                    duration: this.duration
                })
                if (stopProcessing.status == 200) {
                    fs.unlinkSync(path.join(TEMPDIR + "/video/", data.fileName));
                    console.log("video file deleted succefully 🟢");
                } else {
                    console.log("🔴 post to next api, cannot delete the video file")
                }
            } catch (error) {
                console.log((error as Error).message, "🔴 post to next api")
            }
        })
    }

}

export const imageUpload = async (req: Request, res: Response) => {
    try {
        console.log("🟡 image upload started")
        const { fileName, ContentType } = req.body;
        const Key = fileName;
        const file=req.file;
        if (!file) {
            console.log("🔴 file not found");
            res.status(400).json({ message: "file not found" });
            return
        }
        const Bucket = process.env.BUCKET_NAME || "faizy-s3";

        const Command = new PutObjectCommand({
            Key,
            Bucket,
            ContentType,
            Body: file.buffer
        })

        const fileStatus = await s3.send(Command)

        if (fileStatus['$metadata'].httpStatusCode === 200) {
            console.log("🟢 succesfully video upload to s3 bucket");
            res.status(200).json({ message: "file uploaded successfully" });
        } else {
            console.log("🔴 failed to upload video to s3 bucket", fileStatus);
            res.status(400).json({ message: "file uploaded failed" });
        }
    } catch (error) {
        console.log("🔴 failed to upload video to s3 bucket", (error as Error).message, error);
        return;
    }
}
