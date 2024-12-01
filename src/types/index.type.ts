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