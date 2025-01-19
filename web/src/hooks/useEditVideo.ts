import { editVideoInfoSchema } from '@/schemas/schema' 
import useZodForm from './useZodForm'
import { useMutationData } from './useMutation' 
import { editVideoInfo } from '@/actions/video'

export const useEditVideo = (
  videoId: string,
  title: string,
  description: string,
  thumbnail:string
) => {
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    (data: { title: string; description: string ,thumbnail:string}) =>
      editVideoInfo(videoId, data.title, data.description,data.thumbnail),
    'preview-video'
  )
  const { errors, onFormSubmit, register } = useZodForm(
    editVideoInfoSchema,
    mutate,
    {
      title,
      description,
    }
  )

  return { onFormSubmit, register, errors, isPending }
}
