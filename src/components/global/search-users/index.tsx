import { Button } from "@nextui-org/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationData } from "@/hooks/useMutation";
import { useSearch } from "@/hooks/useSearch";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import React from "react";
import { inviteMembers } from "@/actions/user";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchUser from "./searchUser";

interface Props {
  workspaceId: string;
}

const SerachUsers = ({ workspaceId }: Props) => {
  const { onSearchQuery, onUsers, isFetching, query } = useSearch(
    "get-users",
    "USERS"
  );

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        onChange={onSearchQuery}
        value={query}
        className="focus:bg-transparent bg-primary-foreground  border-[1px] outline-0 outline-transparent ring-0 outline-none"
        placeholder="Search for your user..."
        type="text"
      />

      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 p-5 rounded-xl" />
          <Skeleton className="w-full h-8 p-5 rounded-xl" />
          <Skeleton className="w-full h-8 p-5 rounded-xl" />
        </div>
      ) : !onUsers ? (
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
      ) : (
        <ScrollArea className="max-h-[10rem]">
          <div className="flex flex-col gap-y-2">
            {onUsers.map((user) => (
              <SearchUser key={user.id} user={user} workspaceId={workspaceId} />  
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default SerachUsers;
