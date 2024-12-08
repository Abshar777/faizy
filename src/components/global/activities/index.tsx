import CommentForm from "@/components/forms/comment-form";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";

interface Props {
  videoId: string;
  author: string;
}

const Activities = ({ videoId, author }: Props) => {
  return (
    <TabsContent value="Activity" asChild>
      <div className="flex w-full flex-col bg-muted-foreground/5 p-4 rounded-lg text-2xl gap-y-4">
        <CommentForm videoId={videoId} author={author} />
      </div>
    </TabsContent>
  );
};

export default Activities;
