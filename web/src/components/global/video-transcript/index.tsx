import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { json } from "stream/consumers";

type Props = {
  transcript: string;
};

const VideoTranscript = ({ transcript }: Props) => {
  const transcript2=JSON.parse(transcript);
  return (
    <TabsContent
      value="Transcript"
      asChild
    >
      <div className="flex w-full flex-col bg-muted-foreground/5 p-4 rounded-lg text-md gap-y-4">
        <p className="text-muted-foreground">{transcript2?.summary}</p>
      </div>
    </TabsContent>
  );
};

export default VideoTranscript;
