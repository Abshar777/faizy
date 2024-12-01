import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  icon: React.ReactNode
  title: string
  href: string
  selected: boolean
  notifications?: number
}

const SidebarItem = ({ href, icon, selected, title, notifications }: Props) => {
  return (
    <li className="cursor-pointer  my-[5px]">
      <Link
        href={href}
        className={cn(
          'flex items-center justify-between group rounded-lg hover:bg-primary-foreground',
          selected ? 'bg-primary-foreground' : ''
        )}
      >
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
          {icon}
          <span
            className={cn(
              'font-medium text-sm group-hover:text-foreground/90 transition-all truncate w-32',
              selected ? 'text-foreground/90' : 'text-foreground/30'
            )}
          >
            {title}
          </span>
        </div>
        <p className=" -translate-x-2 text-sm text-muted-foreground/30">
          {!!notifications && notifications}
        </p>
      </Link>
    </li>
  )
}

export default SidebarItem
