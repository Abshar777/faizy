"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { MdOutlinePostAdd } from "react-icons/md";
import { getWorkSpaces } from "@/actions/workspace";
import Modal from "../modal";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "@/components/forms/wokspcaForm";
import { Button } from "@nextui-org/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {}

const CreatePost = (props: Props) => {
  const isMobile = useIsMobile();
  return (
    <Modal
      title="Create a Post"
      description="Creating a post allows you to share your thoughts and updates with your team. You can easily collaborate and keep everyone informed in your personal workspace."
      trigger={
        <Button
          size={isMobile ? "sm" : "md"}
          className="bg-muted-foreground/5 hover:bg-muted-foreground/10  text-sm text-muted-foreground flex items-center gap-2 py-6  rounded-2xl"
        >
          <MdOutlinePostAdd />
          {!isMobile && "Create Post"}
        </Button>
      }
    >
      {" "}
    </Modal>
  );
};

export default CreatePost;
