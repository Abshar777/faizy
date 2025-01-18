import { Request, Response } from "express";
import fs from "fs"
import { TDataFromSocket, TprocessVideo } from "../types/index.type";
import { Readable } from "stream"
import path from "path";
import axios from "axios";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client";
import { TEMPDIR } from "../constants";
import { createTranscription } from "../helper/transcription";



export class socketHandle {
    private recorderdChunks: Blob[];
    private audioRecorderdedChunks: Blob[];
    constructor() {
        this.recorderdChunks = [];
        this.audioRecorderdedChunks = [];
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
        const buffer = Buffer.from(await videoBlob.arrayBuffer());
        const readStream = Readable.from(buffer);
        readStream.pipe(writeStream).on("finish", () => {
            console.log("⚪ chunk saved")
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
            const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`)
            this.audioRecorderdedChunks = [];
           await createTranscription(data.fileName, data.userId)
        } catch (error) {
            console.log(error,"🔴 post to next api, when proccesing the audio file")
        }
    }




    // async handleProcessingOfVideo(data: TprocessVideo) {
    //     this.recorderdChunks = [];
    //     fs.readFile(path.join(TEMPDIR,data.fileName),async(err,file)=>{
    //        try {
    //         const processing=await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`)
    //         if(processing.data.status!==200) return console.log("🔴 post to next api");
    //         const Key=data.fileName;
    //         const Bucket=process.env.BUCKET_NAME;
    //         const ContentType="video/webm";
    //         const Command=new PutObjectCommand({
    //             Key,
    //             Bucket,
    //             ContentType,
    //             Body:file
    //         })
    //         const fileStatus=await s3.send(Command)
    //         if(fileStatus['$metadata'].httpStatusCode===200) console.log("🟢 succesfully video upload to s3 bucket");

    //         // pro plan feature
    //         if(processing.data.plan==="PRO"){

    //         }

    //        } catch (error) {
    //         console.log(error,"🔴 post to next api")
    //        }
    //     })
    // }

}
