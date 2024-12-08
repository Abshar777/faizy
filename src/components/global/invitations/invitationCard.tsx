"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@nextui-org/button";
import { useMutationData } from "@/hooks/useMutation";
import { acceptInvite } from "../../../../actions/user";

interface Props {
  user: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  } | null;
  id: string;
  content: string;
  accepted: boolean;
}

const InvitationCard = ({ user, id, content, accepted }: Props) => {
  const { mutate, isPending } = useMutationData(
    ["accept-invitation"],
    (invitationId: string) => acceptInvite(invitationId),
    "user-invitations"
  );
  return (
    <div className="mt-2" >
      <div className="flex bg-muted-foreground/5 px-3 py-3 justify-between rounded-md items-center gap-x-4">
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>{user?.firstname?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-muted-foreground"></h1>
            <h1 className="text-sm">{content}</h1>
          </div>
        </div>
        <Button isLoading={isPending} color="secondary" disabled={accepted} onClick={() => mutate(id)}>
          {accepted ? "Accepted" : "Accept"}
        </Button>
      </div>
    </div>
  );
};

export default InvitationCard;
