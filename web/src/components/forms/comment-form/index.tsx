"use client";
import FormGenerator from "@/components/global/form-generator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVideoComment } from "@/hooks/useVideoComment";
import { Button } from "@nextui-org/button";
import { Send } from "lucide-react";
import React from "react";

interface Props {
  videoId: string;
  commentId?: string;
  author: string;
  close?: Function;
  user: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    image: string | null;
} | undefined;
}

const CommentForm = ({ videoId, commentId, author, close,user }: Props) => {
  const { register, onFormSubmit, errors } = useVideoComment(videoId);
  return (
    <form
      onSubmit={onFormSubmit}
      className="relative w-full flex gap-x-2 items-center"
    >
      <div className="p-1">
        <Avatar className="w-8 h-8 ">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.firstname&&user?.firstname?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <FormGenerator
          register={register}
          inputType="input"
          placeholder="Add a comment"
          name="comment"
          errors={errors}
          showError={false}
          className="focus:bg-background flex-1 w-full focus:border-themeGray"
        />
      </div>
      <Button variant="light" isIconOnly size="sm" type="submit">
        <Send size={18} className="text-muted-foreground" />
      </Button>
    </form>
  );
};

export default CommentForm;
