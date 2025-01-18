import fs from "fs";
import path from "path";
import { TEMPDIR } from "../constants";
import { assemblyClient } from "../config/assemblyAi";
import axios from "axios";




export const createTranscription = async (fileName: string, userId: string) => {
    return fs.readFile(path.join(TEMPDIR + "/audio/", fileName), async(err, file) => {
        if (!err) {
            const params = {
                audio: file,
                speaker_labels: true
            }
            const run = async () => {
                const transcript = await assemblyClient.transcripts.transcribe(params)

                if (transcript.status === 'error') {
                    console.error(`Transcription failed: ${transcript.error}`)
                    process.exit(1)
                }

                console.log(transcript.text, '   text')
                const text = transcript.text;
                const title = text?.split(".")?.[0] || "Untitled";
                const json = JSON.stringify({
                    title,
                    summary: text
                })
                if (json) {
                    try {
                        const transcriptionGenrated = await axios.post(`${process.env.NEXT_API_HOST}recording/${userId}/transcribe`, {
                            fileName: fileName.split(".")[0] + ".webm",
                            content: text,
                            transcript: json
                        })
                        return json
                    } catch (error) {
                        console.log("error transipcption error🔴", error)
                    }
                }
            }
           const transcription=await run();
           if(transcription){
           try {
            const stopProcessing=await axios.post(`${process.env.NEXT_API_HOST}recording/${userId}/complete`,{
                fileName
            })
            if(stopProcessing.status==200){
                fs.unlinkSync(path.join(TEMPDIR + "/audio/", fileName))
                fs.unlinkSync(path.join(TEMPDIR + "/video/", fileName.split(".")[0]+".webm"))
                console.log("file deleted succefully 🟢");
                
            }
           } catch (error) {
                console.log("🔴 stop proccesing",error)
           }
           }
          
        } else {
            console.log(err)
        }
    })
}








