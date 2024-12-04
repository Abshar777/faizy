import { useAppSelector } from "@/store/store"
import { TFolder } from "@/types/index.type";
import { useEffect, useState } from "react";
import { useMutationData } from "./useMutation";
import { getWorkspaceFolders, moveVideoLocation } from "../../actions/workspace";
import useZodForm from "./useZodForm";
import { moveVideoSchema } from "@/schemas/folderSchema";

export const useMoveVideos = (videoId: string, currenWorkspace: string) => {
    const { folders } = useAppSelector(state => state.folders);
    const { workspaces } = useAppSelector(state => state.workspace);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFolders, setFolders] = useState<TFolder[] | undefined>(undefined)


    const { mutate, isPending } = useMutationData(
        ["change-video-location"],
        (data: { folderId: string, workspaceId: string }) => moveVideoLocation(videoId, currenWorkspace, data.folderId),
    )
    const { errors, handleSubmit, onFormSubmit, register, reset, watch } = useZodForm(moveVideoSchema, mutate, { folderId: null, workspaceId: currenWorkspace })

    const fetchFolders = async (workspaceId: string) => {
        setIsFetching(true)
        const folders = await getWorkspaceFolders(workspaceId)
        setFolders(folders.data)
        setIsFetching(false);
    }

    useEffect(() => {
        fetchFolders(currenWorkspace)
    }, []);

    useEffect(() => {
        const workspace = watch(async (value) => {
            if (value.workspaceId) fetchFolders(value.workspaceId)
        })
        return () => workspace.unsubscribe()
    })

    return { mutate, isPending, errors, handleSubmit, onFormSubmit, register,  fetchFolders, isFetching, folders,workspaces,isFolders }
}