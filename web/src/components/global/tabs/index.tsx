import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react'

interface Props {
    triggers:string[];
    children:React.ReactNode;
    defaultTab:string;
}

const TabMenu = ({ triggers, children, defaultTab }: Props) => {
    return (
        <Tabs defaultValue={defaultTab} className='w-full flex flex-col items-start  py-2 justify-start'> 
            <TabsList className='flex justify-start bg-transparent'>
                {triggers.map((trigger,index)=>(
                    <TabsTrigger key={index}  className="p-[.5rem] px-6 rounded-full data-[state=active]:bg-background  capitalize" value={trigger}>{trigger}</TabsTrigger>
                ))}
            </TabsList>
            {children}
        </Tabs>
    )
}

export default TabMenu
