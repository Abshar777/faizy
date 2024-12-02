import { createFolder } from "../../actions/workspace"
import { useMutationData } from "./useMutation"

export const useCreateFolder = (workspaceId: string) => {
    const { mutate } = useMutationData(["create-folder"],
        () => createFolder(workspaceId),
        'workspace-folders')
    const onCreateNewFolder = () => mutate({ name: "Untitled", id: "optimistc--id" })
    return { onCreateNewFolder }
}
