import { z } from 'zod'
export const editVideoInfoSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Video title must have atleast 5 characters' }),
  description: z.string().min(20, {
    message: 'Video description must have atleast 20 characters',
  }),
  thumbnail: z
    .union([
      z.instanceof(File).refine(
        (file) => file.type.startsWith("image/"),
        { message: "Only image files are allowed." }
      ),
      z.undefined(),
    ])
    .optional(),
})
