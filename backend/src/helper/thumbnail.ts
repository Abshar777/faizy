

import ffmpeg from "fluent-ffmpeg"
import { TEMPDIR } from "../constants";
import path from "path"

export const getThumbnail=(fileName:string)=>{
     const outPutPath=Date.now()+"thumbnail.png";
     ffmpeg(path.join(TEMPDIR+'/video/',fileName)).seekInput(0.1).frames(1).output(outPutPath).on("end",()=>{
        console.log(outPutPath)
     }).run()
}