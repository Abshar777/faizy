import express from "express";
import { imageUpload } from "../controller/controller";
import multer from "multer";


const router = express.Router();
const upload=multer()

router.post("/upload",upload.single("file"),imageUpload)


export default router;
