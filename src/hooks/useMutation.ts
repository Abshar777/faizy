import { MutationFunction, MutationKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useMutationData = (mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    queryKey?: string,
    onSuccess?: (data: any) => void
) => {
    const client = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationKey,
        mutationFn,
        onSuccess(data) {
            // if (queryKey) client.invalidateQueries({ queryKey: [queryKey] as unknown as readonly unknown[] })
            if (onSuccess) onSuccess(data);
            toast.success(data.message, {
                description: data.description
            })
        },
        onSettled: async () => {
            return await client.invalidateQueries({ queryKey: [queryKey]})
        }
    })
    return { mutate, isPending }
}