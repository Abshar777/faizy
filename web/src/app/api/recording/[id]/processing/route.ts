import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const body = await req.json();
        const { id } = params;

        const user = await client.user.findUnique({
            where: { clerkid: id },
            select: { workspace: true, id: true },
        });
        const personalworkspaceId = user?.workspace
            .filter((w) => w.type === "PERSONAL")
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((w) => w.id)[0];

        if (!personalworkspaceId) {
            console.log("🔴 workspac did'nt found");

            return NextResponse.json({ status: 400, error: "Personal workspace not found" });
        }
        const startProcessingVideo = await client.workSpace.update({
            where: {
                id: personalworkspaceId,
            },
            data: {
                videos: {
                    create: {
                        source: body.fileName,
                        userId: user.id,
                    },
                },
            },
            select: {
                User: {
                    select: {
                        subscription: {
                            select: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        })


        if (startProcessingVideo) {
            return NextResponse.json({
                status: 200,
                plan: startProcessingVideo.User?.subscription?.plan
            })
        }
        return new NextResponse(
            JSON.stringify({ message: '🔴 Failed to process video' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.log("🔴  on proccesing api error : ", (error as Error).message)
        return new NextResponse(
            JSON.stringify({ message: '🔴 Failed to process video' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
    }
}