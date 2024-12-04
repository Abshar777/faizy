import React from "react";
import Modal from "../modal";
import { Button } from "@nextui-org/button";
import { TbArrowsMove } from "react-icons/tb";
import ChangeVideoLocation from "@/components/forms/changeVideoLoactionForm";

interface Props {
  currentFolderName: string;
  videoId: string;
  currentWorkspace: string;
  currentFolder: string;
}


const VideoCardMenu = ({
  currentFolderName,
  videoId,
  currentWorkspace,
  currentFolder,
}: Props) => {

  return (
    <Modal
      trigger={
        <Button isIconOnly size="sm" className="">
          <TbArrowsMove />
        </Button>
      }
      title="Move to new Workspace"
      description="Select a workspace to move this video to"
      className="flex items-center cursor-pointer gap-x-2"
    >
      <>
        <ChangeVideoLocation
          videoId={videoId}
          currentFolder={currentFolder}
          currentWorkspace={currentWorkspace}
          currentFolderName={currentFolderName}
        />
      </>
    </Modal>
  );
};

export default VideoCardMenu;
