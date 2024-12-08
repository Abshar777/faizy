import { TabsContent } from "@/components/ui/tabs";
import React from "react";

type Props = {
  transcript: string;
};

const VideoTranscript = ({ transcript }: Props) => {
  return (
    <TabsContent
      value="Transcript"
      asChild
    >
      <div className="flex w-full flex-col bg-muted-foreground/5 p-4 rounded-lg text-2xl gap-y-4">
        <p className="text-muted-foreground">{transcript}</p>
      </div>
    </TabsContent>
  );
};

export default VideoTranscript;
