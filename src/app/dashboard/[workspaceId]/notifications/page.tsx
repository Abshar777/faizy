"use client";
import React from "react";
import { getNotifications } from "../../../../../actions/user";
import { useQueryData } from "@/hooks/useQueryData";
import { NotificationProps } from "@/types/index.type";

import { PiSealWarningDuotone } from "react-icons/pi";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {}

const NotificationPage = (props: Props) => {
  const { data } = useQueryData(["user-notifications"], getNotifications);
  const { data: notifications, status } = data as NotificationProps;
  return (
    <div className="flex flex-col gap-y-3 h-full">
      {status === 200 && notifications?.notification?.length > 0 ? (
        notifications?.notification?.map((notification) => (
          <div key={notification.id} className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src={notification.image || ""} />
                <AvatarFallback>
                  {notification.firstname?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-semibold text-muted-foreground">
                {notification.firstname} {notification.lastname}
              </h1>
            </div>
            <h1 className="text-sm">{notification.content}</h1>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-3/4 gap-x-2">
          <PiSealWarningDuotone className="text-muted-foreground \" />
          <h1 className="text-sm text-muted-foreground flex items-center gap-x-2">
            No Notifications
          </h1>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
