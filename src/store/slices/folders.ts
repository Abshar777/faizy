import { initialFolderStateProps } from "@/types/index.type";
import { createSlice } from "@reduxjs/toolkit";

const initialState:initialFolderStateProps = {
    folders:[]
}

 const folderSlice = createSlice({
    name:"folders",
    initialState,
    reducers:{
        setFolders:(state,action)=>{
            state.folders = action.payload
        }
    }
})

export const {setFolders} = folderSlice.actions;
export default folderSlice.reducer;
