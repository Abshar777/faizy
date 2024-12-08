import { $Enums } from "@prisma/client";

export type WorkspaceProps = {
  data: {
    subscription: {
      plan: "FREE" | "PRO";
    } | null,
    workspace: {
      id: string;
      name: string;
      type: "PERSONAL" | "PUBLIC";
    }[],
    members: {
      WorkSpace: {
        id: string;
        name: string;
        type: "PERSONAL" | "PUBLIC";
      } | null;
    }[]
  }
}


export type CommentRepliesProps = {
  id: string
  comment: string
  createdAt: Date
  commentId: string | null
  userId: string | null
  videoId: string | null
  User: {
    id: string
    email: string
    firstname: string | null
    lastname: string | null
    createdAt: Date
    clerkid: string
    image: string | null
    trial: boolean
    firstView: boolean
  } | null
}

export type VideoCommentProps = {
  data: {
    User: {
      id: string
      email: string
      firstname: string | null
      lastname: string | null
      createdAt: Date
      clerkid: string
      image: string | null
      trial: boolean
      firstView: boolean
    } | null
    reply: CommentRepliesProps[]
    id: string
    comment: string
    createdAt: Date
    commentId: string | null
    userId: string | null
    videoId: string | null
  }[]
}


export type NotificationProps = {
  status: number
  data: {
    notification: {
      id: string;
      userId: string | null;
      content: string;
      sender: {
        name: string;
        image: string | null;
      } | null;
      createdAt: Date;
    }[];
    _count: {
      notification: number;
    };
  };
}



export type FoldersProps = {
  status: number
  data: ({
    _count: {
      videos: number
    }
  } & {
    id: string
    name: string
    createdAt: Date
    workSpaceId: string | null
  })[]
}

export type FolderProp = {
  status: number;
  data: {
    name: string;
    _count: {
      videos: number;
    };
  };
};

export type VideosProps = {
  status: number;
  data: VideoProps[];
};

export type VideoProps = {
  User: {
    firstname: string | null
    lastname: string | null
    image: string | null
  } | null
  id: string
  processing: boolean
  Folder: {
    id: string
    name: string
  } | null
  createdAt: Date
  title: string | null
  source: string;
  thumbnail: string;
}


export type initialFolderStateProps = {
  folders: TFolder[]
}

export type TFolder = ({
  _count: {
    videos: number
  }
} & {
  id: string
  name: string
  createdAt: Date
  workSpaceId: string | null
})

export type initialWorkSpaceStateProps = {
  workspaces: {
    id: string,
    name: string,
    type: "PERSONAL" | "PUBLIC"
  }[]
}

export type VideoPreviewProp = {
  status: number
  data: {
    User: {
      firstname: string | null
      lastname: string | null
      image: string | null
      clerkId: string
      trial: boolean
      subscription: {
        plan: 'PRO' | 'FREE'
      } | null
    } | null
    title: string | null
    description: string | null
    source: string
    views: number
    createdAt: Date
    processing: boolean
    summery: string,
    thumbnail: string
  }
  author: boolean
}

export type UserProfileProps = {
  status: number;
  data?: undefined;
} | {
  status: number;
  data: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  };
}

export type TUser = {
  image: string | null;
  id: string;
  email: string;
  subscription: {
    plan: $Enums.SUBSCRIPTION_PLAN;
  } | null;
  firstname: string | null;
  lastname: string | null;
};


export type InvitationProps = {
  status: number;
  data: {
    id: string;
    reciever: {
      firstname: string | null;
      lastname: string | null;
      image: string | null;
    } | null;
    sender: {
      firstname: string | null;
      lastname: string | null;
      image: string | null;
    } | null;
    content: string;
    accepted: boolean;

  }[] | [];
  message?: undefined;
};

