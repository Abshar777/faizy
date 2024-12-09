import { getMediaResourse } from "@/api/auth";
import { TSourceDeviceAction, TSourceDeviceState } from "@/types/index.type";
import { useReducer } from "react";
import { toast } from "sonner";



const reducer = (state: TSourceDeviceState, action: TSourceDeviceAction) => {
    switch (action.type) {
        case "GET_DEVICES":
            return { ...state, devices: action.payload }
        default:
            return state
    }
}

const initialState: TSourceDeviceState = {
    displays: [],
    audioInputs: [],
    error: null,
    isPending: false
}

export const useMediaResourse = () => {
    const [state, action] = useReducer(reducer, initialState);

    const fetchMediaResourse = async () => {
        action({ type: "GET_DEVICES", payload: { isPending: true } });
        getMediaResourse().then((data) => {
            action({ type: "GET_DEVICES", payload: {
                displays: data.displays,
                audioInputs: data.audio,
                isPending: false
            } })
        }).catch((error) => {
            toast.error(error.message)
            action({ type: "GET_DEVICES", payload: { error: error.message, isPending: false } })
        })
    }

    return { state, fetchMediaResourse }
};




