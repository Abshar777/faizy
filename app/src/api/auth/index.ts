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


export const getMediaResourse = async () => {
    const displays=await window.ipcRenderer.invoke("getSources");
    const enumerateDevices=await window.navigator.mediaDevices.enumerateDevices();
    const audioInputs=enumerateDevices.filter(device=>device.kind==="audioinput");
   return {displays,audio:audioInputs}
}
