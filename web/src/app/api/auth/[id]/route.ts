import { client } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    console.log('ent point hit 👉');
    try {
        const userProfile = await client.user.findUnique({
            where: {
                clerkid: params.id
            },
            include: {
                studio: true,
                subscription: true,

            }
        })
        if (!userProfile) {
            const clerkClientMethod = await clerkClient()
            const userId = params.id
            const user = await clerkClientMethod.users.getUser(userId)
            const newUser = await client.user.create({
                data: {
                    email: user.emailAddresses[0].emailAddress,
                    clerkid: user.id,
                    firstname: user.firstName || "",
                    lastname: user.lastName || "",
                    image: user.imageUrl || "",
                    studio: { create: {} },
                    workspace: {
                        create: {
                            name: `${user.firstName || ""} Workspace`,
                            type: "PERSONAL"
                        }
                    },
                    subscription: { create: {} },
                },
                include: {
                    workspace: true,
                    subscription: true

                }
            })
            return NextResponse.json({ message: "User created successfully", data: newUser }, { status: 200 })
        }
        return NextResponse.json({ message: "User found", data: userProfile }, { status: 200 })
    } catch (error) {
        console.log(error, "error");
        return NextResponse.json({ message: "Internal server error", stack: error }, { status: 500 })

    }
}