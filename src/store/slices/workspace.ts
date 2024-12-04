import { initialWorkSpaceStateProps } from "@/types/index.type";
import { createSlice } from "@reduxjs/toolkit";

const initialState:initialWorkSpaceStateProps = {
    workspaces:[]
}

const workspaceSlice = createSlice({
    name:"workspace",
    initialState,
    reducers:{
        setWorkspace:(state,action)=>{
            state.workspaces = action.payload
        }
    }
})

export const {setWorkspace} = workspaceSlice.actions;
export default workspaceSlice.reducer;
    
