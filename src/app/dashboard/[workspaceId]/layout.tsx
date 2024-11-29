import React from 'react'
import { onAuthenticateUser } from '../../../../actions/user';
import { redirect } from 'next/navigation';
import { verfyAccessToWorkSapce } from '../../../../actions/workspace';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface Props {
    params: {
        workspaceId: string;
    }
    children: React.ReactNode;
}

const layout = async({ children, params: { workspaceId } }: Props) => {
    const auth = await onAuthenticateUser();
    if(!auth.data?.workspace) return redirect("/auth/sign-in");
    if(!auth.data.workspace.length) return redirect("/auth/sign-in");
    const hasAcces=await verfyAccessToWorkSapce(workspaceId);
    if(hasAcces.status!==200) return redirect(`/dashboard/${auth.data.workspace[0].id}`);
    if(!hasAcces.data?.workspace) return null;
    
    return (
        <div>
            {children}
        </div>
    )
}

export default layout
