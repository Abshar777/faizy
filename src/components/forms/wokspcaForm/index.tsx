"use client";
import FormGenerator from "@/components/global/form-generator";
import { DialogClose } from "@/components/ui/dialog";
import { useCreateWokspace } from "@/hooks/useCreateWokspace";
import { Button } from "@nextui-org/button";
import React, { useEffect, useRef } from "react";
import { getWorkSpaces } from "@/actions/workspace";
import { useQueryClient } from "@tanstack/react-query";

interface Props {}

const WorkspaceForm = ({}: Props) => {
  const client = useQueryClient();
  const { errors, onFormSubmit, register, isPending, isSuccess } =
    useCreateWokspace();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isSuccess) {
      (async () => {
        await client.invalidateQueries({
          queryKey: ["user-workspace"],
          exact: true,
        });
        ref.current?.click();
      })();
    }
  }, [isSuccess]);

  return (
    <div>
      <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
        <FormGenerator
          inputType="input"
          label="Workspace Name"
          placeholder="Enter Workspace Name"
          name="name"
          errors={errors}
          register={register}
        />
        <DialogClose ref={ref}></DialogClose>
        <Button
          color="primary"
          isLoading={isPending}
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default WorkspaceForm;
