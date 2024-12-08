"use client";
import FormGenerator from "@/components/global/form-generator";
import { useVideoComment } from "@/hooks/useVideoComment";
import { Button } from "@nextui-org/button";
import { Send } from "lucide-react";
import React from "react";

interface Props {
  videoId: string;
  commentId?: string;
  author: string;
  close?: Function;
}

const CommentForm = ({ videoId, commentId, author, close }: Props) => {
  const { register, onFormSubmit, errors } = useVideoComment(videoId);
  return (
    <form onSubmit={onFormSubmit} className="relative w-full flex gap-x-2 items-center">
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
      <Button variant="light" isIconOnly size="sm" type="submit" > 
        <Send size={18} className="text-muted-foreground"/>
      </Button>
    </form>
  );
};

export default CommentForm;
