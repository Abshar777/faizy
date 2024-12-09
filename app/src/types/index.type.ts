export type TUser = {
    image: string | null;
    id: string;
    email: string;
    firstname: string | null;
    lastname: string | null;
};

export type TSubscription = {
    plan: "FREE" | "PRO";
};

export type TStudio = {
    id: string;
    screen: string;
    mic: string | null;
    preset: string | null;
    camera: string | null;
    userId: string;
}

export type TProfile = {
    subscription: TSubscription | null;
    studio: TStudio | null;
} & TUser;


export type TSourceDeviceState={
    displays?:{
        appIcon:null,
        display_id:string,
        id:string,
        name:string,
        thumbnail:unknown[],
    }[];
    audioInputs?:{
       deviceId:string,
       kind:string,
       label:string,
       groupId:string,
    }[];
    error?:string | null;
    isPending:boolean;
}


export type TSourceDeviceAction={
    type:"GET_DEVICES",
    payload?:TSourceDeviceState
}
