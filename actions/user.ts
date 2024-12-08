"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser()
        if (!user) return { status: 403, message: "Unauthorized" }
        const userExist = await client.user.findFirst({
            where: {
                OR: [
                    { clerkid: user.id },
                    { email: user.emailAddresses[0].emailAddress },
                ],
            },
            include: {
                workspace: true
            },
        })
        if (userExist) {
            return { status: 200, data: userExist, message: "User already exists" };
        }

        if (userExist) return { status: 200, data: userExist, message: "User already exists" }
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
                subscription: {
                    select: {
                        plan: true
                    }
                }
            }
        })
        if (newUser) return { status: 201, data: newUser, message: "User created successfully" };
        return { status: 400, message: "Failed to create user" }
    } catch (error) {
        console.log(error, "error");
        return { status: 500, message: "Internal Server Error" }
    }
}



export const getNotifications = async () => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
        const notifications = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                image: true,
                firstname: true,
                lastname: true,
                notification: true,

                _count: {
                    select: {
                        notification: true,
                    },
                },
            },
        })

        if (notifications && notifications.notification.length > 0)
            return { status: 200, data: notifications }
        return { status: 404, data: [] }
    } catch (error) {
        return { status: 400, data: [] }
    }
}

export const searchUsers = async (query: string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }

        const users = await client.user.findMany({
            where: {
                OR: [
                    { firstname: { contains: query } },
                    { email: { contains: query } },
                    { lastname: { contains: query } },
                ],
                NOT: [{ clerkid: user.id }],
            },
            select: {
                id: true,
                subscription: {
                    select: {
                        plan: true,
                    },
                },
                firstname: true,
                lastname: true,
                image: true,
                email: true,
            },
        })

        if (users && users.length > 0) {
            return { status: 200, data: users }
        }

        return { status: 404, data: undefined }
    } catch (error) {
        return { status: 500, data: undefined }
    }
}



export const getUserProfile = async () => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
        const profileIdAndImage = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                image: true,
                id: true,
                firstname: true,
                lastname: true,
            },
        })

        if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
    } catch (error) {
        return { status: 400 }
    }
}


export const enableFirstView = async (state: boolean) => {
    try {
        const user = await currentUser()

        if (!user) return { status: 404 }

        const view = await client.user.update({
            where: {
                clerkid: user.id,
            },
            data: {
                firstView: state,
            },
        })

        if (view) {
            return { status: 200, data: 'Setting updated' }
        }
    } catch (error) {
        return { status: 400 }
    }
}

export const getFirstView = async () => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
        const userData = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                firstView: true,
            },
        })
        if (userData) {
            return { status: 200, data: userData.firstView }
        }
        return { status: 400, data: false }
    } catch (error) {
        return { status: 400 }
    }
}
