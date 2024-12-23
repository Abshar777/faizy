import { studioSettingsSchema } from "@/schemas/studioSettings.schema"
import useZodForm from "./useZodForm"
import { useEffect, useState } from "react"
import { useMutationData } from "./useMutation";
import { updateStudioSetting } from "@/api/studio";
import { toast } from "sonner";

export const useStudioSetting = (
    id: string,
    screen?: string,
    audio?: string,
    preset?: "HD" | "SD",
    plan?: "PRO" | "FREE"
) => {
    const [onPreset, setonPreset] = useState<"HD" | "SD" | undefined>();
    const onSuccess = () => {
        toast.success("Studio settings updated successfully");
    }
    const { mutate, isPending, } = useMutationData(
        ['upadete-studio'],
        (data:{ screen: string, audio: string, preset: "HD" | "SD" }) => updateStudioSetting(id, data.screen, data.audio, data.preset),
        "studio-settings",
        onSuccess
    );

    const { register, watch, setValue, onFormSubmit } = useZodForm(studioSettingsSchema, mutate, {
        screen,
        audio,
        preset,
    });

    useEffect(() => {
        if (screen && audio && preset) {
            window.ipcRenderer.send("media-sources", {
                screen,
                audio,
                preset
            })
        }
    }, [onPreset]);
    useEffect(() => {
        const subscription = watch((values) => {
            setonPreset(values.preset);
            if (values.screen && values.audio && values.preset) {
                mutate({ id, screen: values.screen, audio: values.audio, preset: values.preset });
                window.ipcRenderer.send("media-sources", {
                    screen: values.screen,
                    audio: values.audio,
                    preset: values.preset
                })
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return { register, isPending, setValue, onFormSubmit }

}