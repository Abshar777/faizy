import { Message } from "@/components/icons";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@nextui-org/button";
import React from "react";
import { MdDownloading } from "react-icons/md";

interface Props {
  plan: "PRO" | "FREE";
  trial: boolean;
  videoId: string;
}

const AiTools = ({ plan, trial, videoId }: Props) => {
  return (
    <TabsContent
      value="Ai Tools"
      className="flex w-full flex-col bg-muted-foreground/5 p-4 rounded-lg text-2xl gap-y-4"
    >
      <div className="flex items-center w-full">
        <div className="w-full flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">AI Tools</h2>
            <div className="flex items-center gap-x-2">
              <Button color="primary" size="sm">
                Try Now
              </Button>
              <Button color="secondary" size="sm">
                Pay Now
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Taking your videos to the next <br />
            step with the power of AI
          </p>
        </div>
      </div>
      <div className="flex bg-primary-foreground border w-full p-4 rounded-lg items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-x-2">
          <VideoRecorderDuotone /> Genrate Video Summary
        </p>
        <Button color="primary" size="sm">
          Generate
        </Button>
      </div>
      <div className="flex bg-primary-foreground border w-full p-4 rounded-lg items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-x-2">
          <Message /> Create And Read Video Transcript
        </p>
        <Button color="primary" size="sm">
          Create 
        </Button>
      </div>
      <div className="flex bg-primary-foreground border w-full p-4 rounded-lg items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-x-2">
          <MdDownloading className="text-2xl" /> Download As Audio File
        </p>
        <Button color="primary" size="sm">
          Download 
        </Button>
      </div>
    </TabsContent>
  );
};

export default AiTools;
