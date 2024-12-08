"use client";
import CommentForm from "@/components/forms/comment-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types/index.type";
import { Button } from "@nextui-org/button";
import { Dot, DotIcon } from "lucide-react";
import React, { useState } from "react";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProps[];
  isReply?: boolean;
  createdAt: Date;
};

const CommentCard = ({
  author,
  comment,
  reply,
  videoId,
  commentId,
  isReply,
  createdAt,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);
  const daysAgo = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );
  

  return (
    <Card
      className={cn(
        "p-2 bg-background/40 flex mt-2 gap-x-2  border-none shadow-none"
      )}
    >
      <div className="p-1">
        <Avatar className="w-10 h-10 ">
          <AvatarImage src={author.image} />
          <AvatarFallback>{author.firstname.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col">
        <div className="flex gap-x-2 items-center">
          <p className="capitalize text-xs text-secondary-foreground items-center flex">
            {author.firstname} {author.lastname}{" "}
            <div className="flex items-center gap-[0]">
              <DotIcon className="text-muted-foreground " />
              <span className="text-muted-foreground -  text-xs ml-[-6px]">
                {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
              </span>
            </div>
          </p>
        </div>
        <div>
          <p className="text-secondary-foreground text-sm ">{comment}</p>
        </div>
      </div>

      {reply.length > 0 && (
        <div className="flex flex-col gap-y-10 mt-5  border-l-2">
          {reply.map((r) => (
            <CommentCard
              isReply
              reply={[]}
              comment={r.comment}
              commentId={r.commentId!}
              videoId={videoId}
              key={r.id}
              author={{
                image: r.User?.image!,
                firstname: r.User?.firstname!,
                lastname: r.User?.lastname!,
              }}
              createdAt={r.createdAt}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentCard;
