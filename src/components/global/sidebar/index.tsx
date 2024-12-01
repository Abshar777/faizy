"use client";
import React from "react";
import Image from "next/image";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getWorkSpaces } from "../../../../actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { NotificationProps, WorkspaceProps } from "@/types/index.type";
import Modal from "../modal";
import { Link, Menu, PlusIcon } from "lucide-react";
import SerachUsers from "../search-users";
import { MENU_ITEMS } from "@/constants";
import SidebarItems from "./sidebar-items";
import WorkspacePlaceholder from "./workspaceholder";
import { ScrollArea } from "@/components/ui/scroll-area";
import GlobalCard from "../global-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../infobar";
interface Props {
  activeWorkspaceId: string;
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const { data } = useQueryData(["user-workspaces"], getWorkSpaces);
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getWorkSpaces
  );
  const { data: count } = notifications as NotificationProps;
  const { data: workspaces } = data as WorkspaceProps;
  const onChangeActiveWorkspace = (value: string) =>
    router.push(`/dashboard/${value}`);
  const pathname = usePathname();
  const currenntWorkspace = workspaces.workspace.find(
    (ws) => ws.id === activeWorkspaceId
  );
  const menuItems = MENU_ITEMS(activeWorkspaceId);

  const SidebarSection = (
    <div className="bg-[#111111] flex-none p-4 h-full w-[250px] flex-col relative flex gap-3 items-center overflow-hidden">
      <div className="bg-[#111111] px-4 py-6 gap-3 flex justify-center w-full items-center mb-4 absolute top-0 left-0 right-0">
        <Image src="/Faizy.svg" alt="Faizy" width={70} height={70} />
      </div>
      <div className="absolute top-[-2rem] left-[-10rem] rounded-full w-full bg-gradient-to-tr blur-3xl from-[#ffffff55] to-transparent  h-[4rem]" />
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 outline-none outline-0 text-muted-foreground  bg-background">
          <SelectValue
            className="outline-0 "
            placeholder="Select a workspace"
          />
        </SelectTrigger>
        <SelectContent className="outline-none outline-0 bg-background/20 backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspaces.workspace.map((workspace) => (
              <SelectItem
                className="mt-1 cursor-pointer "
                value={workspace.id}
                key={workspace.id}
              >
                {workspace.name}
              </SelectItem>
            ))}
            {workspaces.members.length > 0 &&
              workspaces.members.map(
                (workspace) =>
                  workspace.WorkSpace && (
                    <SelectItem
                      value={workspace.WorkSpace.id}
                      key={workspace.WorkSpace.id}
                    >
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currenntWorkspace?.type === "PUBLIC" &&
        workspaces.subscription?.plan == "PRO" && (
          <Modal
            trigger={
              <span className="text-sm cursor-pointer flex items-center gap-2 transition-all duration-[.3] ease-in justify-center bg-neutral-700/30 border-t border-t-neutral-500/20 hover:bg-neutral-700/60 p-[5px] w-full rounded-sm ">
                <span className="text-neutral-400 font-semibold text-xs">
                  invite Workspace
                </span>{" "}
                <PlusIcon className="w-4 h-4" />
              </span>
            }
            title="Create Workspace"
            description="Create a new workspace"
          >
            <SerachUsers workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-primary/90 font-bold mt-4 px-1">Menu</p>
      <nav className="w-full">
        <ul className="w-full ">
          {menuItems.map((item, index) => (
            <SidebarItems
              href={item.href}
              icon={item.icon}
              key={index}
              title={item.title}
              notifications={
                (item.title === "Notifications" &&
                  count._count &&
                  count._count.notification) ||
                0
              }
              selected={item.href === pathname}
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-primary/90 font-bold mt-4">Workspaces</p>

      <nav className="w-full">
        {workspaces.members.length == 0 &&
          workspaces.workspace.length === 1 && (
            <div className="w-full justify-center items-center ">
              <p className="text-muted-foreground text-xs">
                {workspaces.subscription?.plan === "FREE"
                  ? "You are on free plan, upgrade to PRO plan to create more workspaces"
                  : "No "}
              </p>
            </div>
          )}
        <ScrollArea className="h-[130px] py-1  fade-layer">
          <ul>
            {workspaces.workspace.length > 0 &&
              workspaces.workspace.map(
                (e) =>
                  e.type !== "PERSONAL" && (
                    <SidebarItems
                      title={e.name}
                      key={e.id}
                      icon={
                        <WorkspacePlaceholder>
                          {e.name.slice(0, 2)}
                        </WorkspacePlaceholder>
                      }
                      href={`/dashboard/${e.id}`}
                      selected={pathname === `/dashboard/${e.id}`}
                    />
                  )
              )}
            {workspaces.members.length > 0 &&
              workspaces.members.map(
                (e) =>
                  e.WorkSpace && (
                    <SidebarItems
                      title={e.WorkSpace.name}
                      key={e.WorkSpace.id}
                      icon={
                        <WorkspacePlaceholder>
                          {e.WorkSpace.name.slice(0, 2)}
                        </WorkspacePlaceholder>
                      }
                      href={`/dashboard/${e.WorkSpace.id}`}
                      selected={pathname === `/dashboard/${e.WorkSpace.id}`}
                    />
                  )
              )}
          </ul>
        </ScrollArea>
      </nav>
      <Separator className="w-4/5" />
      {workspaces.subscription?.plan == "FREE" && (
        <>
          <GlobalCard
            title="Upgrade to PRO plan"
            description="Upgrade to PRO plan to create more workspaces"
            footer={
              <Button
                variant={"secondary"}
                className="w-full bg-muted-foreground/10 uppercase border-t hover:bg-background/30 backdrop-blur-lg active:scale-[.9] transition-all duration-[.3] ease-in"
              >
                Upgrade
              </Button>
            }
          ></GlobalCard>
        </>
      )}
    </div>
  );
  return (
    <div className="full">
      <InfoBar />
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
