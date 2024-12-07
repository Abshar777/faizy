import { addViewer } from "../../actions/video";
import { useMutationData } from "./useMutation";

export const useUpdateViews = () => {
  const { mutate } = useMutationData(
    ["update-views"],
    (data: { videoId: string}) => addViewer(data.videoId),
    "video"
  );
  return { mutate };
};
