import { useForm } from "react-hook-form";
import { commentSchema } from "@/schemas/commentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentAndReply } from "@/actions/video";
import { useMutationData } from "./useMutation";
import { useQueryData } from "./useQueryData";
import { z } from "zod";
import useZodForm from "./useZodForm";
import { getUserProfile } from "@/actions/user";

export const useVideoComment = (videoId: string, commentId?: string) => {
    const { mutate } = useMutationData(
        ['new-comment'],
        (data: { comment: string }) => createCommentAndReply( data.comment, videoId, commentId),
        'video-comments',
        ()=>reset()
    )
    const { register, onFormSubmit, errors, reset } = useZodForm(commentSchema,mutate)
    return { mutate, register, onFormSubmit, errors,reset }


};