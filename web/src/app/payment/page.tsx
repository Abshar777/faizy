import { completeSubscription } from '@/actions/subscription'
import { redirect } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  searchParams: { session_id?: string; cancel?: boolean }
}

const page = async ({ searchParams: { cancel, session_id } }: Props) => {
  if (session_id) {
    const customer = await completeSubscription(session_id)
    if (customer.status === 200) {
        toast.success(customer.message)
      return redirect('/auth/callback')
    }
    toast.error(customer.message)
    return redirect('/')
  }

  if (cancel) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <h4 className="text-5xl font-bold">404</h4>
        <p className="text-xl text-center">Oops! Something went wrong</p>
      </div>
    )
  }
}

export default page
