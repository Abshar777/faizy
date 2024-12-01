'use client'
import { QueryClient } from "@tanstack/react-query";
import { getAllUserVideos, getWorkspaceFolders, getWorkSpaces } from "../../actions/workspace";
import { getNotifications } from "../../actions/user";



export const prefetchWorkspaceFolders = async (workspaceId: string) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["workspace-folders"],
        queryFn: () => getWorkspaceFolders(workspaceId)
    })
    await queryClient.prefetchQuery({
        queryKey: ["user-videos"],
        queryFn: () => getAllUserVideos(workspaceId)
    })
    await queryClient.prefetchQuery({
        queryKey: ['user-workspaces'],
        queryFn: () => getWorkSpaces(),
    })

    await queryClient.prefetchQuery({
        queryKey: ['user-notifications'],
        queryFn: () => getNotifications(),
    })

    return queryClient;
}



