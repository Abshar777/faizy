import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";




export const uploadImage = async (file: File, id: string) => {
    try {
        // cors()
        const fileName = `${uuid()}-${file.name}`
        const ContentType = file.type;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("ContentType", ContentType);
        const { data } = await axios.post("http://localhost:3001/upload", formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        if (data) {
            console.log("🟢 image uploaded to s3 bucket", data.message);
            return fileName
        }
        return;
    } catch (error) {
        console.log("🔴 failed to upload video to s3 bucket", (error as Error).message, error);
        return;
    }
}