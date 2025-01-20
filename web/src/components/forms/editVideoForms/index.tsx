"use client";
import FormGenerator from "@/components/global/form-generator";
import ImageUploader from "@/components/global/imageUploader";
import { DialogClose } from "@/components/ui/dialog";
import { useEditVideo } from "@/hooks/useEditVideo";
import { Button } from "@nextui-org/button";
import React, { useEffect } from "react";

interface Props {
  videoId: string;
  title: string;
  description: string;
  thumbnail?: string;
  summery?: string;
}

const EditVideoForm = ({
  videoId,
  description,
  title,
  summery,
  thumbnail,

}: Props) => {
    const ref = React.useRef<HTMLButtonElement>(null);
    const onSubmit=()=>{
     if(ref.current) ref.current.click();
    }
  const { errors, isPending, onFormSubmit, register,setValue } = useEditVideo(
    videoId,
    title,
    description,
    onSubmit
  );
  // console.log(thumbnail,"thumbnail");
  let thumbnailLink=thumbnail
  let stremUrl =
    process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL ||
    "https://d3m6ajsnw89gp6.cloudfront.net";

  if (title !== "Source Fight" && title !== "Agenet Fight") {
   if(thumbnailLink) thumbnailLink=`${stremUrl}/${thumbnail}`
  }
  
  return (
    <form className="flex flex-col w-full gap-5" onSubmit={onFormSubmit}>
        <div className="w-full">
            <ImageUploader setValues={setValue} thumbnail={thumbnailLink} errors={errors} name="thumbnail" register={register}/>
        </div>
      <div className="w-full -mt-4">
        <FormGenerator
          label="title"
          register={register}
          inputType="input"
          placeholder="Add a Title"
          name="title"
          errors={errors}
          showError={false}
          className="focus:bg-background flex-1 w-full focus:border-themeGray"
        />
      </div>
      <div className="w-full">
        <FormGenerator
          label="description"
          register={register}
          inputType="textarea"
          placeholder="Add a description"
          name="description"
          errors={errors}
          showError={false}
          className="focus:bg-background flex-1 w-full focus:border-themeGray"
        />
      </div>
      <div className="w-full">
    <DialogClose ref={ref}></DialogClose>    
      <Button
          color="primary"
          isLoading={isPending}
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default EditVideoForm;
