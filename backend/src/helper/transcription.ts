import fs from "fs";
import path from "path";
import { TEMPDIR } from "../constants";
import { assemblyClient } from "../config/assemblyAi";
import axios from "axios";




export const createTranscription = async (fileName: string, userId: string) => {
    
    return fs.readFile(path.join(TEMPDIR + "/audio/", fileName), async (err, file) => {
        if (!err) {
            const params = {
                audio: file,
                speaker_labels: true
            }
           
            
            const run = async () => {
                const transcript = await assemblyClient.transcripts.transcribe(params)

                if (transcript.status === 'error') {
                    console.error(`Transcription failed: ${transcript.error}`)
                    // process.exit(1)
                }
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
                            transcript: json,
                            title
                        })
                        return json
                    } catch (error) {
                        console.log("error transipcption error🔴", (error as Error).message)
                    }
                }
            }
            const transcription = await run();
            if (transcription) {
                fs.unlinkSync(path.join(TEMPDIR + "/audio/", fileName));
                console.log("file deleted succefully 🟢");
            }

        } else {
            console.log(err.message,"when reading file for transcription 🔴")
        }
    })
}








