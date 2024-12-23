import { Settings } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { useStudioSetting } from "@/hooks/useStudioSetting";
import { TProfile, TSourceDeviceState, TUser } from "@/types/index.type";
import { Button } from "@nextui-org/button";
import { Loader, Mic, Monitor, Save } from "lucide-react";
import { IoIosSave } from "react-icons/io";
import { MdOutlineScreenShare } from "react-icons/md";

interface Props {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInputs?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  user: TProfile;
}

const MediaConfiguration = ({ displays, user, audioInputs }: Props) => {
  const activeScreen = displays?.find(
    (screen) => screen.id === user.studio?.screen
  );

  const activeAudio = audioInputs?.find(
    (audio) => audio.deviceId === user.studio?.mic
  );

  const { register, isPending, setValue, onFormSubmit } = useStudioSetting(
    user.id,
    user?.studio?.screen || displays?.[0]?.id,
    user?.studio?.mic || audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );
  console.log(displays);
  return (
    <form
      onSubmit={onFormSubmit}
      className="w-full h-full flex flex-col relative gap-y-4 items-center"
    >
      <div className="flex gap-x-5  w-full items-center">
        <Mic color="#575655" size={"20px"} />
        <Select onValueChange={(value) => setValue("audio", value)}>
          <SelectTrigger className="bg-primary border-[1px] border-white/20 px-2  w-[85%]   text-white backdrop-blur-xl">
            <SelectValue placeholder="Select mic" className=" ml-2 " />
          </SelectTrigger>
          <SelectContent className="outline-none z-[999999999999999999]  outline-0 bg-primary/20 border-[1px] border-white/20   text-white backdrop-blur-xl">
            <SelectGroup>
              <SelectLabel>Screen</SelectLabel>
              <SelectSeparator className="bg-white/20" />
              {audioInputs?.map((mic) => (
                <SelectItem
                  className="flex  min-w-[100px]"
                  key={mic.deviceId}
                  value={mic.deviceId}
                >
                  <div className="flex w-full  gap-x-1 justify-between items-center">
                    {mic.label}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-x-5 w-full justify-center items-center">
        <Monitor fill="#575655" color="#575655" size={20} />
        <Select onValueChange={(value) => setValue("screen", value)}>
          <SelectTrigger className="bg-primary border-[1px] border-white/20 px-2  w-full   text-white backdrop-blur-xl">
            <SelectValue placeholder="Select Screen" className=" ml-2 " />
          </SelectTrigger>
          <SelectContent className="outline-none z-[999999999999999999]  outline-0 bg-primary/20 border-[1px] border-white/20   text-white backdrop-blur-xl">
            <SelectGroup>
              <SelectLabel>Screen</SelectLabel>
              <SelectSeparator className="bg-white/20" />
              {displays?.map((screen) => (
                <SelectItem
                  className="flex  min-w-[100px]"
                  key={screen.id}
                  value={screen.id}
                >
                  <div className="flex w-full  gap-x-1 justify-between items-center">
                    {screen.appIcon ? (
                      <img
                        className="w-5 h-5  rounded-full "
                        src={screen.appIcon || ""}
                        alt=""
                      />
                    ) : (
                      <MdOutlineScreenShare />
                    )}{" "}
                    {screen.name}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-x-5 w-full justify-center items-center">
        <Settings />
        <Select onValueChange={(value) => setValue("preset", value)}>
          <SelectTrigger className="bg-primary border-[1px] border-white/20 px-2    text-white backdrop-blur-xl">
            <SelectValue placeholder="Select Quality" className="  " />
          </SelectTrigger>
          <SelectContent className="outline-none z-[999999999999999999]  outline-0 bg-primary/20 border-[1px] border-white/20   text-white backdrop-blur-xl">
            <SelectGroup>
              <SelectLabel>Quality</SelectLabel>
              <SelectSeparator className="bg-white/20" />
              <SelectItem value="SD">720</SelectItem>
              <SelectItem
                disabled={user?.subscription?.plan !== "PRO"}
                value="HD"
              >
                1080
                {user?.subscription?.plan === "PRO" && (
                  <span className="text-xs ml-2 text-white/50">PRO</span>
                )}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex gap-x-3 justify-center items-center">
        <IoIosSave  color="#575655" size={25} />
        <Button isLoading={isPending} type="submit" color="secondary" className="w-full ml-1">
          Save
        </Button>
      </div>
    </form>
  );
};

export default MediaConfiguration;
