"use client";
import React, { useEffect } from "react";
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
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
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
import { Button } from "@nextui-org/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../infobar";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/store";
import { WORKSPACES } from "@/store/slices/workspace";
import { useMutationDataState } from "@/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
interface Props {
  activeWorkspaceId: string;
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const client = useQueryClient();
  const { data, isFetched, refetch } = useQueryData(["user-workspace"], () => {
    console.log("stared1aaaa");
    return getWorkSpaces();
  });
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
  const { latestVaribales } = useMutationDataState(["user-workspace"]);
  console.log(pathname.split("/")[3]);
  useEffect(() => {
    if (isFetched && workspaces)
      dispatch(WORKSPACES({ workspaces: workspaces.workspace }));
  }, [isFetched, workspaces]);
  useEffect(() => {
    if (latestVaribales) {
      dispatch(WORKSPACES({ workspaces: [latestVaribales.variables] }));
    }
  }, [latestVaribales]);
  const SidebarSection = (
    <div className="bg-[#111111] flex-none p-4 h-screen w-[250px] flex-col relative flex gap-3 items-center overflow-hidden">
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
              <Button
                size="sm"
                className="text-sm cursor-pointer flex items-center gap-2 transition-all duration-[.3] ease-in justify-center bg-neutral-700/30 border-t border-t-neutral-500/20 hover:bg-neutral-700/60 p-[5px] w-full rounded-sm "
              >
                <span className="text-neutral-400 font-semibold text-xs">
                  invite Workspace
                </span>{" "}
                <PlusIcon className="w-4 h-4" />
              </Button>
            }
            title="Create Workspace"
            description="Create a new workspace"
          >
            <SerachUsers workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-primary/90 font-bold mt-4 px-1">Menu</p>
      {/* menu */}
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
              selected={
                pathname.includes(item.name)
                  ? true
                  : !pathname.split("/")[3] && item.name == "library"
                  ? true
                  : false
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-[90%]" />
      <div className="w-full flex items-center justify-between">
        <p className="w-full text-primary/90 font-bold mt-4 px-1">Workspaces</p>
      </div>
      {/* members and workspaces */}
      <nav className="w-full px-1">
        {workspaces.members.length == 0 &&
          workspaces.workspace.length === 1 && (
            <div className="w-full justify-center items-center ">
              <p className="text-muted-foreground text-xs">
                {workspaces.subscription?.plan === "FREE"
                  ? "You are on free plan, upgrade to PRO plan to create more workspaces"
                  : " "}
              </p>
            </div>
          )}
        <ScrollArea
          className={cn(
            " py-1  fade-layer",
            workspaces.subscription?.plan !== "FREE"
              ? "h-[130px]"
              : "h-[20%] py-5"
          )}
        >
          <ul>
            {latestVaribales && latestVaribales.status === "pending" && (
              <SidebarItems
                title={latestVaribales.variables.name}
                key={latestVaribales.variables.id}
                icon={
                  <WorkspacePlaceholder>
                    {latestVaribales.variables.name.slice(0, 2)}
                  </WorkspacePlaceholder>
                }
                href={`/dashboard/${latestVaribales.variables.id}`}
                selected={
                  pathname === `/dashboard/${latestVaribales.variables.id}`
                }
                optimistic={true}
              />
            )}
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
      <Separator className="w-[90%]" />

      {/*subscription part */}
      {workspaces.subscription?.plan == "FREE" && (
        <>
          <div className="fixed  bottom-0 p-4">
            <GlobalCard
              title="Upgrade to PRO plan"
              description="Upgrade to PRO plan to create more workspaces"
              footer={
                <Button className="w-full bg-muted-foreground/10 uppercase border-t hover:bg-background/30 backdrop-blur-lg active:scale-[.9] transition-all duration-[.3] ease-in">
                  Upgrade
                </Button>
              }
            ></GlobalCard>
          </div>
        </>
      )}
    </div>
  );
  return (
    <div className="full">
      <InfoBar />
      <div className="md:hidden z-[999999999999999999] fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button isIconOnly variant="light" className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="p-0 z-[99999999999999999999] w-fit h-full"
          >
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden relative h-full z-[11]">
        {SidebarSection}
      </div>
    </div>
  );
};

export default Sidebar;
