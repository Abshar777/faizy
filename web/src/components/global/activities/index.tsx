"use client";
import { useQueryData } from "@/hooks/useQueryData";
import { getVideoComments } from "@/actions/video";
import CommentForm from "@/components/forms/comment-form";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import CommentCard from "../commentCard";
import { UserProfileProps, VideoCommentProps } from "@/types/index.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserProfile } from "@/actions/user";

interface Props {
  videoId: string;
  author: string;
}

const Activities = ({ videoId, author }: Props) => {
  const { data } = useQueryData(["video-comments"], () =>
    getVideoComments(videoId)
  );
  const { data: user } = useQueryData(["user-profile"], getUserProfile);
  const {data: userData} = user as UserProfileProps;
  const { data: comments } = data as VideoCommentProps;

  return (
    <TabsContent value="Activity" asChild>
      <div className="flex w-full flex-col bg-muted-foreground/5 p-4 rounded-lg text-2xl gap-y-2">
        <CommentForm user={userData} videoId={videoId} author={author}  />
        <div className="" />
        <ScrollArea className="h-[20rem]">
          {comments?.map((comment) => (
            <CommentCard
              comment={comment.comment}
              key={comment.id}
              author={{
                image: comment.User?.image!,
                firstname: comment.User?.firstname!,
                lastname: comment.User?.lastname!,
              }}
              videoId={videoId}
              reply={comment.reply}
              commentId={comment.id}
              createdAt={comment.createdAt}
            />
          ))}
        </ScrollArea>
      </div>
    </TabsContent>
  );
};

export default Activities;
