import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutationData } from '@/hooks/useMutation';
import { useSearch } from '@/hooks/useSearch';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import React from 'react'

interface Props {
    workspaceId: string;
}

const SerachUsers = ({ workspaceId }: Props) => {
    const { onSearchQuery, onUsers, isFetching, query } = useSearch("get-users", "USERS");
    // const {}=useMutationData(['invite-member'],(data:{recieverId:string,email:string})=>{

    // })
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
        <div className="flex flex-col gap-y-2">
          {onUsers.map((user) => (
            <div
              key={user.id}
              className="flex gap-x-3 hover:bg-primary-foreground cursor-pointer transition-all duration-[.3] ease-in items-center border-[1px] w-full p-2 rounded-xl"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="text-bold text-md capitalize">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                  {user.subscription?.plan}
                </p>
              </div>
              <div className="flex-1 flex justify-end items-center">
                <Button
                  onClick={() =>{}
                    // mutate({ recieverId: user.id, email: user.email })
                  }
                  variant={'default'}
                  className="px-7 border-t  active:scale-95 transition-all duration-[.3] ease-in font-bold text-xs"
                >
                    {false ? <Loader className="animate-spin" /> : "Invite"}
                  {/* <Loader
                    // state={isPending}
                    color="#000"
                  >
                    Invite
                  </Loader> */}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    )
}

export default SerachUsers;
