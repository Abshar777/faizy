"use client"
import { Button } from "@nextui-org/button";
import { FaCode } from "react-icons/fa6";
import React from "react";
import { toast } from "sonner";
import { Tooltip } from "@nextui-org/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = { title: string; id: string; source: string; description: string };

const RichLink = ({ description, id, source, title }: Props) => {
  const copyRichText = () => {
    const orignalTitle = title;
    const thumbnail = `<a style="display: flex; flex-direction: column; gap: 10px" href="${process.env.NEXT_PUBLIC_HOST_URL}/preview/${id}">
    <h3 style="text-decoration: none; color: black; margin: 0;">${orignalTitle}</h3>
    <p style="text-decoration: none; color: black; margin: 0;">${description}</p>
    <video
        width="320"
        style="display: block"
        >
            <source
                type="video/webm"
                src="${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${source}"
            />
        </video>
    </a>`;
    const thumbnailBlob = new Blob([thumbnail], { type: "text/html" });
    const blobTitle = new Blob([orignalTitle], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        ["text/plain"]: blobTitle,
        ["text/html"]: thumbnailBlob,
      }),
    ];
    navigator.clipboard.write(data).then(() => {
      return toast.success("Embedded Link Copied", {
        description: "Successfully copied embedded link",
      });
    });
  };
  const isMobile = useIsMobile()
  return (
    <Tooltip placement="bottom" content="Get Embedded Code">
      <Button color="primary" onClick={copyRichText}  size="md">
        <FaCode />
        {!isMobile && "Get Embedded Code"}
      </Button>
    </Tooltip>
  );
};

export default RichLink;
