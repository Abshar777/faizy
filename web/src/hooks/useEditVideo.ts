import { editVideoInfoSchema } from '@/schemas/schema'
import useZodForm from './useZodForm'
import { useMutationData } from './useMutation'
import { editVideoInfo } from '@/actions/video'
import { uploadImage } from '@/actions/s3'


const handleSubmit = async (
  videoId: string,
  title: string,
  description: string,
  thumbnail?: File
) => {
  if (thumbnail) {
    const thumbnailFile = await uploadImage(thumbnail, videoId)
    return  editVideoInfo(videoId, title, description, thumbnailFile)
  }
  return  editVideoInfo(videoId, title, description)
}


export const useEditVideo = (
  videoId: string,
  title: string,
  description: string,
  onSucces?: Function
) => {
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    (data: { title: string; description: string, thumbnail: File }) => handleSubmit(videoId, data.title, data.description, data.thumbnail),
    'preview-video',
    () => {
      if (onSucces) onSucces()
    }

  )
  const { errors, onFormSubmit, register, setValue } = useZodForm(
    editVideoInfoSchema,
    mutate,
    {
      title,
      description,
    }
  )

  return { onFormSubmit, register, errors, isPending, setValue }
}


