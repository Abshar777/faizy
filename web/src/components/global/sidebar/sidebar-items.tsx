"use client";
import { cn } from "@/lib/utils";
import { Ripple, useRipple } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
  optimistic?: boolean;
};

const SidebarItem = ({
  href,
  icon,
  selected,
  title,
  notifications,
  optimistic,
}: Props) => {
  const { ripples, onClear, onClick } = useRipple();
  return (
    <li className="cursor-pointer relative  my-[5px]">
      <Link
        onClick={onClick}
        href={href}
        className={cn(
          "flex items-center relative overflow-hidden justify-between group rounded-lg hover:bg-primary-foreground",
          selected && "bg-primary-foreground",
          optimistic && "opacity-50 pointer-events-none"
        )}
      >
        <Ripple ripples={ripples} onClear={onClear}  />
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
          {icon}
          <span
            className={cn(
              "font-medium text-sm group-hover:text-foreground/90 transition-all truncate w-32",
              selected ? "text-foreground/90" : "text-foreground/30"
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
  );
};

export default SidebarItem;
