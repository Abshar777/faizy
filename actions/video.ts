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
      select: {
        User: true,
        viewers: true,
        views: true,
      },

    })
    if (!video) return { status: 404, message: 'Video not found' };
    if (video.viewers.includes(userData?.id)) return { status: 201, message: 'User already viewed this video' };
    const updatedVideo = await client.video.update({
      where: { id: videoId },
      data: { viewers: { push: userData?.id }, views: video.views + 1 },
    })
    if ((video.User?.clerkid !== user.id) && video.User?.firstView) {
      await client.user.update({
        where: {
          clerkid: video.User?.clerkid,
        },
        data: {
          notification: {
            create: {
              content: `  ${userData.firstname} viewed your video`,
              sender: {
                name: `${userData.firstname} ${userData.lastname}`,
                image: userData.image,
              },
            },
          },
        },
      })
    }
    if (updatedVideo) return { status: 201, message: 'Viewer added successfully' }
    return { status: 404, message: 'Video not found' }
  } catch (error) {
    return { status: 400, message: 'Oops! something went wrong' + error }
  }
}


export const createCommentAndReply = async (
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, message: 'User not found' }
    const userId = await client.user.findUnique({
      where: { clerkid: user.id },
    });
    if (!userId) return { status: 404, message: 'User not found' }
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId: userId.id,
              videoId,
            },
          },
        },
      })
      if (reply) {
        return { status: 200, message: 'Reply posted' }
      }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId: userId.id,
          },
        },
      },
    })
    if (newComment) return { status: 200, message: 'New comment added' }
  } catch (error) {
    return { status: 400, message: 'Oops! something went wrong \n' + (error as Error).message }
  }
}


export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })

    return { status: 200, data: comments }
  } catch (error) {
    return { status: 400 }
  }
}
