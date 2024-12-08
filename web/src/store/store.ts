import { combineReducers, configureStore } from "@reduxjs/toolkit";
import folderReducer from "./slices/folders";
import workspaceReducer from "./slices/workspace";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers({
    folders:folderReducer,
    workspace:workspaceReducer

})

export const store = configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})   
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;



