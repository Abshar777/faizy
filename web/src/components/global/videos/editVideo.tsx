import React from "react";
import Modal from "../modal";
import { Button } from "@nextui-org/button";
import { TbEditCircle } from "react-icons/tb";
import ChangeVideoLocation from "@/components/forms/changeVideoLoactionForm";

interface Props {
  videoId: string;
  title: string;
  description: string;
  thumbnail?: string;
  summery?: string;
}

const EditVideo = ({
  videoId,
  description,
  summery,
  thumbnail,
  title,
}: Props) => {
  return (
    <Modal
      description="Edit the details of your video including title, description, and thumbnail."
      title="Edit Video"
      trigger={
        <Button isIconOnly={true} className="px-0 rounded-full" variant="light">
          <TbEditCircle className="text-muted-foreground/80" />
        </Button>
      }
    >
      <></>
    </Modal>
  );
};

export default EditVideo;
