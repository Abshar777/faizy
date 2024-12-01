import React from "react";
import { getNotifications, onAuthenticateUser } from "../../../../actions/user";
import { redirect } from "next/navigation";
import {
  getWorkSpaces,
  verfyAccessToWorkSapce,
} from "../../../../actions/workspace";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import Sidebar from "@/components/global/sidebar";
import GlobalHeader from "@/components/global/globalHeader";

interface Props {
  params: {
    workspaceId: string;
  };
  children: React.ReactNode;
}

const layout = async ({ children, params: { workspaceId } }: Props) => {
  const auth = await onAuthenticateUser();
  if (!auth.data?.workspace) return redirect("/auth/sign-in");
  if (!auth.data.workspace.length) return redirect("/auth/sign-in");
  const hasAcces = await verfyAccessToWorkSapce(workspaceId);
  if (hasAcces.status !== 200)
    return redirect(`/dashboard/${auth.data.workspace[0].id}`);
  if (!hasAcces.data?.workspace) return null;
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(),
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAcces.data.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default layout;
