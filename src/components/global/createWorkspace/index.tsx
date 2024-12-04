"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { MdWorkspaces } from "react-icons/md";
import { getWorkSpaces } from "../../../../actions/workspace";
import Modal from "../modal";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "@/components/forms/wokspcaForm";
import { Button } from "@nextui-org/button";
import { useIsMobile } from "@/hooks/use-mobile";


interface Props {}

const CreateWorkspace = (props: Props) => {
  const { data,refetch } = useQueryData(["user-workspace"], getWorkSpaces);
  const isMobile = useIsMobile();
  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };
  
  if (plan.subscription?.plan === "PRO") {
    return (
      <Modal
        title="Create a Workspace"
        description=" Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
        trigger={
          <Button
            size={isMobile ? "sm" : "md"}
            className="bg-muted-foreground/5 hover:bg-muted-foreground/10  text-sm text-muted-foreground flex items-center gap-2 py-6  rounded-2xl"
          >
            <MdWorkspaces />
            {!isMobile && "Create Workspace"}
          </Button>
        }
      >
        {" "}
        <WorkspaceForm />
      </Modal>
    );
  }
  if (plan.subscription?.plan === "FREE") {
    return <div></div>;
  }
};

export default CreateWorkspace;
