"use client";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import { getNotifications } from "../../../../actions/user";
import { PiSealWarningDuotone } from "react-icons/pi";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationProps } from "@/types/index.type";

interface Props {}

const Notification = (props: Props) => {
  const { data } = useQueryData(
    ["user-notifications"],
    () => getNotifications(),
    {
      refetchInterval: 5000,
    }
  );
  const { data: notifications, status } = data as NotificationProps;
  return (
    <ScrollArea className="flex flex-col w-full  gap-y-3  h-[75vh]">
      {status === 200 && notifications?.notification?.length > 0 ? (
        notifications?.notification?.map((notification, index) => {
          const currentDate = new Date(
            notification.createdAt
          ).toLocaleDateString();
          const previousDate =
            index > 0
              ? new Date(
                  notifications.notification[index - 1].createdAt
                ).toLocaleDateString()
              : null;
          const showDate = currentDate !== previousDate;
          const daysAgo = Math.floor(
            notification &&
              (new Date().getTime() -
                new Date(notification.createdAt.getTime()).getTime()) /
                (1000 * 60 * 60 * 24)
          );
          return (
            <div className="mt-2" key={notification.id}>
              {showDate && (
                <div className="flex items-center gap-x-2 my-2">
                  <hr className="flex-grow border-t border-muted-foreground/5" />
                  <span className="text-sm text-muted-foreground/50">
                    {currentDate}
                  </span>
                  <hr className="flex-grow border-t border-muted-foreground/5" />
                </div>
              )}
              <div className="flex bg-muted-foreground/5 px-3 py-3 justify-between rounded-md items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <Avatar>
                    <AvatarImage src={notification.sender?.image || ""} />
                    <AvatarFallback>
                      {notification.sender?.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h1 className="text-sm font-semibold text-muted-foreground">
                      {notification.sender?.name}
                    </h1>
                    <h1 className="text-sm">{notification.content}</h1>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground/50">
                  {daysAgo == 0 ? "Today" : `${daysAgo} days ago`}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center w-full py-10 items-center h-3/4 gap-x-2">
          <PiSealWarningDuotone className="text-muted-foreground \" />
          <h1 className="text-sm text-muted-foreground flex items-center gap-x-2">
            No Notifications
          </h1>
        </div>
      )}
    </ScrollArea>
  );
};

export default Notification;
