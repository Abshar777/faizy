"use client";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/store";
import { TFolder } from "@/types/index.type";
import { useMutationData } from "./useMutation";
import { getWorkspaceFolders } from "../../actions/workspace";
import { moveVideoLocation } from "../../actions/video";
import useZodForm from "./useZodForm";
import { moveVideoSchema } from "@/schemas/folderSchema";
import { useQueryClient } from "@tanstack/react-query";

export const useMoveVideos = (videoId: string, currenWorkspace: string, currentFolder: string) => {
    const { folders } = useAppSelector(state => state.folders);
    const { workspaces } = useAppSelector(state => state.workspace);
    const [isFetching, setIsFetching] = useState(false);
    const [isFolders, setFolders] = useState<TFolder[] | undefined>(undefined);

    const prevWorkspaceRef = useRef(currenWorkspace); // Ref to track previous workspace
    const client = useQueryClient()
    const onSuccess = async (data: any) => {
        await client.invalidateQueries({ queryKey: ["workspace-folders"] })
    }


    const { mutate, isPending, isSuccess } = useMutationData(
        ["change-video-location"],
        (data: { folderId: string; workspaceId: string }) => moveVideoLocation(videoId, currenWorkspace, data.folderId),
        "folder-videos",
        onSuccess

    );


    const { errors, handleSubmit, onFormSubmit, register, watch, setValue } = useZodForm(moveVideoSchema, mutate, {
        folderId: currentFolder,
        workspaceId: currenWorkspace,
    });

    const fetchFolders = async (workspaceId: string) => {
        setIsFetching(true);
        const folders = await getWorkspaceFolders(workspaceId);
        setFolders(folders.data);
        setIsFetching(false);
    };

    useEffect(() => {
        fetchFolders(currenWorkspace);
    }, []);

    useEffect(() => {
        const unsubscribe = watch((value) => {
            const currentWorkspaceId = value.workspaceId;
            if (currentWorkspaceId !== prevWorkspaceRef.current) {
                prevWorkspaceRef.current = currentWorkspaceId; // Update the ref
                fetchFolders(currentWorkspaceId);
            }
        });
        return () => unsubscribe.unsubscribe();
    }, [watch]);

    return {
        isPending,
        errors,
        handleSubmit,
        onFormSubmit,
        register,
        fetchFolders,
        isFetching,
        folders,
        workspaces,
        isFolders,
        setValue,
        isSuccess,
    };
};
