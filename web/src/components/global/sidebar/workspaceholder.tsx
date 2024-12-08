import React from 'react'

interface Props {
    children:React.ReactNode
}

const WorkspacePlaceholder = ({children}: Props) => {
    return (
    <span className="bg-neutral-700/30 flex items-center justify-center font-bold w-8 px-2 h-7 rounded-sm text-muted-foreground">
      {children}
    </span>
  );
}

export default WorkspacePlaceholder
