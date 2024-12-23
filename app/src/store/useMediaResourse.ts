import { getMediaResourse } from "@/api/studio";
import { TSourceDeviceState } from "@/types/index.type";
import { create } from "zustand";
import { toast } from "sonner";

interface MediaResourceState extends TSourceDeviceState {
    fetchMediaResourse: () => Promise<void>;
}

export const useMediaResourse = create<MediaResourceState>((set) => ({
    displays: [],
    audioInputs: [],
    error: null,
    isPending: false,
    fetchMediaResourse: async () => {
        set({ isPending: true });
        try {
            const data = await getMediaResourse();
            set({
                displays: data.displays,
                audioInputs: data.audio,
                isPending: false,
                error: null
            });
            console.log(data);
        } catch (error: any) {
            toast.error(error.message);
            set({ error: error.message, isPending: false });
        }
    }
}));
