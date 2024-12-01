"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { getWorkSpaces } from "../../../../actions/workspace";
import { Button } from "@/components/ui/button";
import Modal from "../modal";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";

interface Props {}

const CreateWorkspace = (props: Props) => {
  const { data } = useQueryData(["user-workspaces"], getWorkSpaces);
  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };
  if (plan.subscription?.plan === "FREE") {
    return (
        <Modal
        title="Create a Workspace"
        description=" Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
        trigger={
          <Button className="bg-muted-foreground/5 hover:bg-muted-foreground/10 text-muted-foreground flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine   />
            Create Workspace
          </Button>
        }
      >
        {" "}
        {/* <WorkspaceForm /> */}
      </Modal>
    );
  }
  if (plan.subscription?.plan === "PRO") {
    return <div>PRO</div>;
  }
 
};

export default CreateWorkspace;
