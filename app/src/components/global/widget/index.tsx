import { getProfile } from "@/api/auth";
import { useMediaResourse } from "@/hooks/useMediaResourse";
import { TProfile } from "@/types/index.type";
import { ClerkLoading, useUser, SignedIn } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {}

const Widget = ({}: Props) => {

    
  const [profile, setprofile] = useState<TProfile | null>(null);
  const { user } = useUser();
  const { fetchMediaResourse, state } = useMediaResourse();

  console.log(state, "state");

  useEffect(() => {
    if (user) {
      getProfile(user.id).then((res) => {
        setprofile(res);
      });
    }
  }, [user]);
  console.log(profile, "profile");
  return (
    <div className="p-5 h-full">
      <ClerkLoading>
        <div className="h-full w-full flex justify-center items-center">
          <Loader className="animate-spin" />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <></>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader className="animate-spin text-white" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;