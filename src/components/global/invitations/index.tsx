"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { acceptInvite, getInvitations } from "../../../../actions/user";
import { InvitationProps } from "@/types/index.type";
import { PiSealWarningDuotone } from "react-icons/pi";

import { ScrollArea } from "@/components/ui/scroll-area";

import InvitationCard from "./invitationCard";

interface Props {}

const Invitation = (props: Props) => {
  const { data } = useQueryData(["user-invitations"], () => getInvitations());

  const { data: invitations, status } = data as InvitationProps;
  return (
    <div className="w-full">
      <ScrollArea className="flex flex-col w-full  gap-y-3  h-[75vh]">
        {status === 200 && invitations?.length > 0 ? (
          invitations?.map((invitation, index) => {
            const user = invitation.reciever;

            return (
              <InvitationCard
                accepted={invitation.accepted}
                content={invitation.content}
                key={invitation.id}
                user={user}
                id={invitation.id}
              />
            );
          })
        ) : (
          <div className="flex justify-center  py-10 w-full items-center h-3/4 gap-x-2">
            <PiSealWarningDuotone className="text-muted-foreground \" />
            <h1 className="text-sm text-muted-foreground flex items-center gap-x-2">
              No Invitations
            </h1>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Invitation;
