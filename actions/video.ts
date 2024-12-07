"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"


export const moveVideoLocation = async (
    videoId: string,
    workSpaceId: string,
    folderId: string
) => {
    try {
        const location = await client.video.update({
            where: {
                id: videoId,
            },
            data: {
                folderId: folderId || null,
                workSpaceId,
            },
        })
        if (location) return { status: 200, message: 'folder changed successfully' }
        return { status: 404, message: 'workspace/folder not found' }
    } catch (error) {
        return { status: 500, message: 'Oops! something went wrong' }
    }
}

export const getPreviewVideo = async (videoId: string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
        const video = await client.video.findUnique({
            where: {
                id: videoId,
            },
            select: {
                title: true,
                createdAt: true,
                source: true,
                description: true,
                processing: true,
                views: true,
                summery: true,
                thumbnail: true,
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                        clerkid: true,
                        trial: true,
                        subscription: {
                            select: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        })
        if (video) {
            return {
                status: 200,
                data: video,
                author: user.id === video.User?.clerkid ? true : false,
            }
        }

        return { status: 404 }
    } catch (error) {
        return { status: 400 }
    }
}

export const editVideoInfo = async (
    videoId: string,
    title: string,
    description: string
) => {
    try {
        const video = await client.video.update({
            where: { id: videoId },
            data: {
                title,
                description,
            },
        })
        if (video) return { status: 200, data: 'Video successfully updated' }
        return { status: 404, data: 'Video not found' }
    } catch (error) {
        return { status: 400 }
    }
}

export const addViewer = async (videoId: string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404, data: 'User not found' };
        const userData = await client.user.findUnique({
            where: { clerkid: user.id },
        })
        if (!userData) return { status: 404, message: 'User not found' };
        const video = await client.video.findUnique({
            where: { id: videoId },
        })
        if (!video) return { status: 404, message: 'Video not found' };
        if (video.viewers.includes(userData?.id)) return { status: 201, message: 'User already viewed this video' };
        const updatedVideo = await client.video.update({
            where: { id: videoId },
            data: { viewers: { push: userData?.id }, views: video.views + 1 },
        })
        if (updatedVideo) return { status: 201, message: 'Viewer added successfully' }
        return { status: 404, message: 'Video not found' }
    } catch (error) {
        return { status: 400, message: 'Oops! something went wrong'+error }
    }
}
