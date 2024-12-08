"use server"
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma"
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string)


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

export const completeSubscription = async (session_id: string) => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
  
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session) {
        const customer = await client.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            subscription: {
              update: {
                data: {
                  customerId: session.customer as string,
                  plan: 'PRO',
                },
              },
            },
          },
        })
        if (customer) {
          return { status: 200,message:"subscription completed"}
        }
      }
      return { status: 404,message:"session not found"}
    } catch (error) {
      return { status: 400,message:"internal server error"+error}
    }
  }