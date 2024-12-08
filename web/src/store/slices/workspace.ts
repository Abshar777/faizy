import { initialWorkSpaceStateProps } from "@/types/index.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: initialWorkSpaceStateProps = {
    workspaces: []
}

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        WORKSPACES: (state, action: PayloadAction<initialWorkSpaceStateProps>) => {
            return { ...action.payload }
        },
    }
})

export const { WORKSPACES } = workspaceSlice.actions;
export default workspaceSlice.reducer;

