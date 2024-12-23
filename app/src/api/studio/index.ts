import { api } from "@/util/axios";

export const updateStudioSetting = async (id: string, screen: string, audio: string, preset: "HD" | "SD") => {
    const { data } = await api.put(`/api/studio/${id}`, { screen, audio, preset })
    return data
}



export const getMediaResourse = async () => {
    try {
        const displays = await window.ipcRenderer.invoke("getSources");
        const enumerateDevices = await window.navigator.mediaDevices.enumerateDevices();
        const audioInputs = enumerateDevices.filter(device => device.kind === "audioinput");
        return { displays, audio: audioInputs }
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch media resources",);
    }
}