import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { id } = params;

        const content = body.content;

        const user = await client.user.findUnique({
            where: { clerkid: id },
        });
        const transcribed = await client.video.update({
            where: {
                userId: user?.id,
                source: body.fileName
            },
            data: {
                title: content.title,
                description: content.summary,
                summery: body.transcript
            }
        })
        if (transcribed) {
            return NextResponse.json({ status: 200, message: "transcribed" })
        } else {
            console.log("🔴 error on transcribe api")
            return NextResponse.json({ status: 400, message: "error transcribe " })

        }
    } catch (error) {
        console.log("🔴 error on transcribe api", (error as Error).message)
        return NextResponse.json({ status: 400, message: "error transcribe " })
    }
}