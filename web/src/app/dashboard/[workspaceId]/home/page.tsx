import React from 'react';
import CreateWorkspace from "@/components/global/createWorkspace";
import CreateFolder from "@/components/global/createFolder";
import { Tabs, TabsList, TabsTrigger,TabsContent } from "@/components/ui/tabs";
import Folders from "@/components/global/folders";
import CreatePost from '@/components/global/createPost';
import Post from '@/components/global/post';

interface Props {
    params:{

    }
}

const index = (props: Props) => {
    return (
        <div>
        <Tabs defaultValue="posts" className="mt-6">
          <div className="flex w-full justify-between items-center">
            <TabsList className="bg-transparent gap-2 pl-0">
              <TabsTrigger
                className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  "
                value="posts"
              >
                posts
              </TabsTrigger>
              <TabsTrigger
                className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  "
                value="Profile"
              >
                Profile
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <CreatePost />
          
            </div>
          </div>
          <section className="py-5">  
            <TabsContent value="posts">
          <Post/>
            </TabsContent>
            <TabsContent value="Profile">Profile</TabsContent>
          </section>
        </Tabs>
      </div>
    )
}

export default index
