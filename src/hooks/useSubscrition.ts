"use client"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

export const useSubscrition = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const onSubscribe = async () => {
        setIsProcessing(true)
        const {data} = await axios.post("/api/payment");
        if(data.status === 200){
            toast.success("Subscription successful");
            return (window.location.href = `${data.session_url}`);
        }else{
            toast.error(data.message)
        }
        setIsProcessing(false)
    }
    return { isProcessing, onSubscribe }
}