"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verfyAccessToWorkSapce = async (workspaceId: string) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 403, message: "User not found" };
        const isUserInWorkspace = await client.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        User: {
                            clerkid: user.id,
                        },
                    },
                    {
                        members: {
                            every: {
                                User: {
                                    clerkid: user.id,
                                },
                            },
                        },
                    },
                ],
            },

        })
        return { status: 200, data: { workspace: isUserInWorkspace }, message: "User has access to workspace" }
    } catch (error) {
        return { status: 403, message: `somthing error happend Error: ${error}` }
    }
}


export const getWorkspaceFolders = async (workSpaceId: string) => {
    try {
        const isFolders = await client.folder.findMany({
            where: {
                workSpaceId,
            },
            include: {
                
                _count: {
                    select: {
                        videos: true,
                    },
                },
            },
        })

        if (isFolders && isFolders.length > 0) return { status: 200, data: isFolders, message: "Folders fetched successfully" }
        return { status: 404, message: "Folders not found", data: [] }
    } catch (error) {
        return { status: 404, message: `somthing error happend Error: ${error}`, data: [] }
    }
}


export const getAllUserVideos = async (workSpaceId: string) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404, message: "user is note exist" };
        const videos = await client.video.findMany({
            where: {
                OR: [{ workSpaceId }, { folderId: workSpaceId }]
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                folderId: true,
                processing: true,
                thumbnail: true,
                Folder: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                User: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        image: true,
                    }
                }

            },
            orderBy: {
                createdAt: "asc"
            }
        })
        if (videos && videos.length > 0) return { status: 200, data: videos, message: "Videos fetched successfully" }
        console.log(videos)
        return { status: 404, message: "Videos not found", data: [] }
    } catch (error) {
        return { status: 404, message: `somthing error happend Error: ${error}`, data: [] }
    }
}


export const getWorkSpaces = async () => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404, message: "user is found" };
        const workspaces = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                subscription: {
                    select: {
                        plan: true,
                    },
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
                members: {
                    select: {
                        WorkSpace: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        })

        if (workspaces) return { status: 200, data: workspaces, message: "Workspace fetched successfully" }
        return { status: 400, message: "Workspace not found", }
    } catch (error) {
        return { status: 400, message: `somthing error happend Error: ${error}` }
    }
}



export const createWorkspace = async (name: string) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404, message: "user is not found" };
        const authrized = await client.user.findUnique({
            where: { clerkid: user.id },
            select: {
                subscription: {
                    select: {
                        plan: true,
                    }
                }
            }
        })
        if (authrized && authrized?.subscription?.plan === "PRO") {
            const workSpace = await client.user.update({
                where: { clerkid: user.id },
                data: {
                    workspace: {
                        create: {
                            name,
                            type: "PUBLIC",
                        },
                    },
                },
            })
            if (workSpace) return { status: 200, message: "Workspace created successfully" }
            return { status: 401, message: "Workspace not created" }
        }
        return { status: 401, message: "You are not authorized to create a workspace" }
    } catch (error) {
        return { status: 400, message: `somthing error happend Error: ${error}` }
    }
}



export const renameFolders = async (folderId: string, name: string) => {
    try {
        const folder = await client.folder.update({
            where: { id: folderId },
            data: { name },
        })
        if (folder) return { status: 200, message: "Folder renamed successfully" }
        return { status: 400, message: "Folder not renamed" }
    } catch (error) {
        return { status: 400, message: `somthing error happend Error: ${error}` }
    }
}

export const createFolder = async (workSpaceId: string) => {
    try {
        const isNewFolder = await client.workSpace.update({
            where: { id: workSpaceId },
            data: {
                folders: {
                    create: {
                        name: "Untitled",
                    }
                }
            },
        })
        if (isNewFolder) return { status: 200, message: "Folder created successfully" }
        return { status: 400, message: "Folder not created" }
    } catch (error) {
        return { status: 400, message: `somthing error happend Error: ${error}` }
    }
}


export const getFolderInfo = async (folderId: string) => {
    try {
        const folder = await client.folder.findUnique({
            where: {
                id: folderId,
            },
            select: {
                name: true,
                _count: {
                    select: {
                        videos: true,
                    },
                },
            },
        })
        if (folder)
            return {
                status: 200,
                data: folder,
                message: "Folder fetched successfully",
            }
        return {
            status: 400,
            data: null,
            message: "Folder not found",
        }
    } catch (error) {
        return {
            status: 500,
            data: null,
            message: `somthing error happend Error: ${error}`,
        }
    }
}


