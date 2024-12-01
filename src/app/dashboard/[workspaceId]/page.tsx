import CreateWorkspace from "@/components/global/createWorkspace";
import { Tabs, TabsList, TabsTrigger   } from "@/components/ui/tabs";
import React from "react";

interface Props {
  params: {
    workspaceId: string;
  };
}

const page = ({}: Props) => {
  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  " value="videos">Videos</TabsTrigger>
            <TabsTrigger className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  " value="folders">Folders</TabsTrigger>
          </TabsList>
          <div className="flex gap-3">
            <CreateWorkspace/>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
