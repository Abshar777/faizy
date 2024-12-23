import { api } from "@/util/axios";
// import { toast } from "sonner";

export const getProfile = async (id: string) => {
    try { 
        const { data } = await api.post(`/api/auth/${id}`,{
            headers:{
                "Content-Type":"application/json"
            }
        });
        // toast.success("Profile fetched successfully", {
        //     description: data.message
        // });
        return data.data;
    } catch (error) {
        console.log(error);
        // toast.error("Failed to fetch profile");
        return null;
    }
};



