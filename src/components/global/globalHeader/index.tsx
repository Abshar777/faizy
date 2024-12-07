"use client"
import { WorkSpace } from '@prisma/client';
import { usePathname } from 'next/navigation';
import React from 'react'

interface Props {
    workspace:WorkSpace
}

const GlobalHeader = ({workspace}: Props) => {
    const pathName=usePathname().split(`/dashboard/${workspace.id}/`)[1]
    const isVideoOrFolder=pathName&&(pathName.includes("video")||pathName.includes("folder"))
    return (
       <article className='flex flex-col gap-2'>
        <span className='text-muted-foreground/50'>{workspace.type.toLocaleLowerCase()} </span>
        <h1 className='text-4xl font-bold'>{pathName&&!isVideoOrFolder?pathName.charAt(0).toUpperCase()+pathName.slice(1):"My Library"}</h1>
      
       </article>
    )
}

export default GlobalHeader;
