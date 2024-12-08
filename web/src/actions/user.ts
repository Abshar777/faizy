"use server"

import { client } from "@/lib/prisma"
import { sendEmail } from "@/util/nodemailer"
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
               
                notification: true,
                createdAt: true,
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


export const inviteMembers = async (
    workspaceId: string,
    recieverId: string,
    email: string
) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
        const reciever = await client.user.findUnique({
            where: {
                id: recieverId,
            },
        });
        if (!reciever) return { status: 404, message: 'recipient not found' }
        const senderInfo = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                image: true,
            },
        })
        if (senderInfo?.id) {
            const workspace = await client.workSpace.findUnique({
                where: {
                    id: workspaceId,
                },
                select: {
                    name: true,
                },
            })
            if (workspace) {
                const invitation = await client.invite.create({
                    data: {
                        senderId: senderInfo.id,
                        recieverId,
                        workSpaceId: workspaceId,
                        content: `You are invited to join ${workspace.name} Workspace`,
                    },
                    select: {
                        id: true,
                    },
                })

                await client.user.update({
                    where: {
                        id: recieverId,
                    },
                    data: {
                        notification: {
                            create: {
                                sender: {
                                    name: `${senderInfo.firstname} ${senderInfo.lastname}`,
                                    image: senderInfo.image,
                                },
                                content: `invited: ${senderInfo.firstname} invited into ${workspace.name}`,
                            },
                        },
                    },
                })
                await client.user.update({
                    where: {
                        id: senderInfo.id,
                    },
                    data: {
                        notification: {
                            create: {
                                sender: {
                                    name: `${reciever.firstname} ${reciever.lastname}`,
                                    image: reciever.image,
                                },
                                content: `invited: ${reciever.firstname} invited into ${workspace.name}`,
                            },
                        },
                    },
                })
                if (invitation) {
                    const { transporter, mailOptions } = await sendEmail(
                        email,
                        'You got an invitation',
                        `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
                        `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
                    )

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('🔴', error.message)
                        } else {
                            console.log('✅ Email send')
                        }
                    })
                    return { status: 200, message: 'Invite sent' }
                }
                return { status: 400, message: 'invitation failed' }
            }
            return { status: 404, message: 'workspace not found' }
        }
        return { status: 404, message: 'recipient not found' }
    } catch (error) {
        console.log(error)
        return { status: 400, message: 'Oops! something went wrong' }
    }
}

export const acceptInvite = async (inviteId: string) => {
    try {
        const user = await currentUser()
        if (!user)
            return {
                status: 404,
                message: "Unauthorized"
            }
        const invitation = await client.invite.findUnique({
            where: {
                id: inviteId,
            },
            select: {
                workSpaceId: true,
                sender: {
                    select: {
                        clerkid: true,
                    }
                },
                reciever: {
                    select: {
                        clerkid: true,
                    },
                },
            },
        })

        if (user.id !== invitation?.reciever?.clerkid) return { status: 401, message: "Unauthorized" }
        const acceptInvite = client.invite.update({
            where: {
                id: inviteId,
            },
            data: {
                accepted: true,
            },
        })
        await client.user.update({
            where: {
                clerkid: invitation.sender?.clerkid,
            },
            data: {
                notification: {
                    create: {
                        content: `accepted: ${user.firstName} ${user.lastName} accepted your invite`,
                        sender: {
                            name: `${user.firstName} ${user.lastName}`,
                            image: user.imageUrl,
                        }
                    },
                    
                },
            },
        })

        const updateMember = client.user.update({
            where: {
                clerkid: user.id,
            },
            data: {
                members: {
                    create: {
                        workSpaceId: invitation.workSpaceId,
                    },
                },
            },
        })

        const membersTransaction = await client.$transaction([
            acceptInvite,
            updateMember,

        ])

        if (membersTransaction) {
            return { status: 200, message: "Invite accepted" }
        }
        return { status: 400, message: "Failed to accept invite" }
    } catch (error) {
        return { status: 400, message: "Failed to accept invite" }
    }
}

export const getInvitations = async () => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404, data: [], message: "Unauthorized" }
        const invitations = await client.invite.findMany({
            where: {
                OR: [
                    { recieverId: user.id },
                ],
            },
            select: {
                id: true,
                sender: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                    },
                },
                reciever: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                    },
                },
               
                accepted: true,
                content: true,
                

            },
        })
        if (invitations && invitations.length > 0) return { status: 200, data: invitations }
        return { status: 404, data: [] }
    } catch (error) {
        return { status: 400, message: "Failed to get invitations", data: [] }
    }
}
