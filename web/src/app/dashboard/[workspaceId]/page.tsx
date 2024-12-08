"use client"
import CreateWorkspace from "@/components/global/createWorkspace";
import CreateFolder from "@/components/global/createFolder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { TabsContent } from "@radix-ui/react-tabs";
import Folders from "@/components/global/folders";

interface Props {
  params: {
    workspaceId: string;
  };
}

const page = ({ params: { workspaceId } }: Props) => {
  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  "
              value="videos"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  "
              value="archive"
            >
              Archive
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-3">
            <CreateWorkspace />
            <CreateFolder workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-5">  
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
          </TabsContent>
          <TabsContent value="archive">Archive</TabsContent>
        </section>
      </Tabs>
    </div>
  );
};

export default page;
