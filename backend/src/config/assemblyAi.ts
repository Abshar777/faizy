import { AssemblyAI } from "assemblyai";
import { config } from "dotenv";

config()

export const assemblyClient = new AssemblyAI({
    apiKey: process.env.ASSEMBLY_AI_API_KEY || ""
})