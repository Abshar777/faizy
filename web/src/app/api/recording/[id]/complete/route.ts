import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
   console.log("hoit");
   
    try {
        const body = await req.json();

        const { id } = params;

        const user=await client.user.findUnique({
            where:{
                clerkid:id
            }
        })
        
        const completeProcessing = await client.video.update({
            where: {
              userId: user?.id,
              source: body.fileName,
            },
            data: {
              processing: false,
              duration:body.duration
            },
          })
    if (completeProcessing) {
        return NextResponse.json({
            status: 200,
            message: "Video processing completed successfully"
        });
    } else {
        return NextResponse.json({
            status: 400,
            message: "Failed to complete video processing"
        });
    }
    } catch (error) {
        console.log("🔴  on  complete proccesing api error : ", (error as Error).message)
        return NextResponse.json({ status: 400, error: "Failed to process video" })

    }

}