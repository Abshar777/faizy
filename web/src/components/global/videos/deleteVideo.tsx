import React, { useRef, useState } from "react";
import Modal from "../modal";
import { Button } from "@nextui-org/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { deleteVideo } from "@/actions/video";
import { toast } from "sonner";
import { DialogClose } from "@/components/ui/dialog";
import { useRouter } from "nextjs-toploader/app";
import { QueryClient } from "@tanstack/react-query";
interface Props {
  videoID: string;
  title: string;
  workspaceId: string;
}

const DeleteVideo = ({ videoID, title, workspaceId }: Props) => {
  const router = useRouter();
  const [state, setstate] = useState("");
  const ref = useRef<HTMLButtonElement>(null);
  const handleClick = async () => {
    const data = await deleteVideo(videoID);
    if (data.status === 200) {
      toast.success(data.message);
      if (ref) ref.current?.click();
      router.push(`/dashboard/${workspaceId}/`);
      const queryClient = new QueryClient();
      queryClient.invalidateQueries({
        queryKey: ["folder-videos"],
      });
    } else {
      toast.error(data.message);
    }
  };
  return (
    <Modal
      description="Are you sure you want to delete this video? This action cannot be undone."
      title="Delete Video"
      trigger={
        <Button
          isIconOnly={true}
          className="px-0 -ml-[1rem] rounded-full"
          variant="light"
        >
          <FaRegTrashCan className="text-muted-foreground/80" />
        </Button>
      }
    >
      {/* <h1 className="text-white">
        Video Name: <span className="opacity-75">{title}</span>{" "}
      </h1> */}
      <div className="w-full">
        <Label className="flex flex-col gap-2 text-[#9D9D9D]">
          <p className="flex text-white">
            please enter &nbsp;
            <strong className="text-red-600">"delete"</strong>&nbsp;to delete
            the video
          </p>
          <div className="flex items-center justify-end">
            {" "}
            <Input
              value={state}
              onChange={(e) => setstate(e.target.value)}
              type="text"
              placeholder="plaese eneter delete"
              className={cn(
                `focus:bg-background/20 placeholder:text-muted-foreground/30 bg-primary-foreground  border-themeGray text-themeTextGray`
              )}
            />
          </div>
        </Label>
      </div>
      <div className="w-full">
        <DialogClose ref={ref}></DialogClose>
        <Button
          disabled={state !== "delete"}
          className={cn(
            "w-full disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          color="primary"
          onClick={handleClick}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteVideo;
