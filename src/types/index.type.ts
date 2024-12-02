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


export type NotificationProps = {
  status: number
  data: {
    _count: {
      notification: number
    }
  }
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
