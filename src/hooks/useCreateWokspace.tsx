"use client";
import { workspaceSchema } from "@/schemas/workspace.schema";
import { createWorkspace } from "@/actions/workspace";
import { useMutationData } from "./useMutation";
import useZodForm from "./useZodForm";

export const useCreateWokspace = () => {
  const { mutate, isPending, isSuccess } = useMutationData(
    ["create-workspace"],
    (data: { name: string }) => createWorkspace(data.name),
    "user-workspace"
  );
  const { errors, onFormSubmit, register } = useZodForm(
    workspaceSchema,
    mutate
  );
  return { errors, onFormSubmit, register, isPending, isSuccess };
};
