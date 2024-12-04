import { initialFolderStateProps } from "@/types/index.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: initialFolderStateProps = {
    folders: []
}

const folderSlice = createSlice({
    name: "folders",
    initialState,
    reducers: {
        FOLDERS: (state, action: PayloadAction<initialFolderStateProps>) => {
            return { ...action.payload }
        },
    }
})

export const { FOLDERS } = folderSlice.actions;
export default folderSlice.reducer;
