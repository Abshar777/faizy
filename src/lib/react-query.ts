import { QueryClient } from "@tanstack/react-query";
import { getAllUserVideos, getWorkspaceFolders, getWorkSpaces } from "../../actions/workspace";
import { getNotifications } from "../../actions/user";

const queryClient=new QueryClient();
export const prefetchWorkspaceFolders=async(workspaceId:string)=>{
    await queryClient.prefetchQuery({
        queryKey:["workspace-folders"],
        queryFn:()=>getWorkspaceFolders(workspaceId)
    })
    await queryClient.prefetchQuery({
        queryKey:["user-videos"],
        queryFn:()=>getAllUserVideos(workspaceId)
    })
    await queryClient.prefetchQuery({
        queryKey: ['user-workspaces'],
        queryFn: () => getWorkSpaces(workspaceId),
      })
    
      await queryClient.prefetchQuery({
        queryKey: ['user-notifications'],
        queryFn: () => getNotifications(workspaceId),
      })
}
