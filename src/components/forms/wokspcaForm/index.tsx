import FormGenerator from '@/components/global/form-generator';
import { useCreateWokspace } from "@/hooks/useCreateWokspace";
import { Button } from '@nextui-org/button';
import React from "react";

interface Props {}

const WorkspaceForm = ({}: Props) => {
  const { errors, onFormSubmit, register, isPending } = useCreateWokspace();
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
        <Button color="primary" isLoading={isPending} type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default WorkspaceForm;
