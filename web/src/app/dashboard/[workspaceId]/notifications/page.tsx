"use client";
import React from "react";

import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notification  from "@/components/global/notification";
import Invitation from "@/components/global/invitations";

interface Props {}

import { Tabs } from "@/components/ui/tabs";
const NotificationPage = (props: Props) => {
  return (
    <Tabs
      defaultValue={"Notifications"}
      className="w-full flex flex-col items-start  py-2 justify-start"
    >
      <TabsList className="flex justify-start bg-transparent">
          <TabsTrigger
         
            className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  capitalize"
            value={"Notifications"}
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  capitalize"
            value="Invitations"
          >
            Invitations
          </TabsTrigger>
      </TabsList>
      <TabsContent className="w-full" value="Notifications">
        <Notification/>
      </TabsContent>
      <TabsContent className="w-full" value="Invitations">
        <Invitation />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationPage;
