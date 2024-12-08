"use server"
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma"

export const getPaymentInfo = async () => {
    try {
        const user = await currentUser();
        if (!user) return {status:404,message:"user not found"};
        const subscription = await client.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                }
            }
        })
        if (!subscription) return {status:404,message:"subscription not found"};
        return {status:200,data:subscription,message:"subscription found"};
    } catch (error) {
        return {status:500,message:"internal server error"+error};
    }

}