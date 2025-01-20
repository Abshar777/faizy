import { editVideoInfoSchema } from '@/schemas/schema' 
import useZodForm from './useZodForm'
import { useMutationData } from './useMutation' 
import { editVideoInfo } from '@/actions/video'

export const useEditVideo = (
  videoId: string,
  title: string,
  description: string,
  thumbnail?:string,
  onSucces?:Function
) => {
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    (data: { title: string; description: string ,thumbnail:File}) =>
      editVideoInfo(videoId, data.title, data.description,data.thumbnail),
    'preview-video',
    ()=>{
      if(onSucces) onSucces()
    }

  )
  const { errors, onFormSubmit, register,setValue } = useZodForm(
    editVideoInfoSchema,
    mutate,
    {
      title,
      description,
      thumbnail
    }
  )

  return { onFormSubmit, register, errors, isPending,setValue }
}
