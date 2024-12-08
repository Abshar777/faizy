import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  
} from "@/components/ui/dialog";
import { Tooltip } from "@nextui-org/tooltip";
import React from "react";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  content?: string;
};

const Modal = ({ children, description, title, trigger, className }: Props) => {
  return (
    <Dialog >
      <Tooltip
        delay={700}
        placement="bottom"
        color="secondary"
        showArrow
        content={title}
      >
        <DialogTrigger className={className} asChild>
          {trigger}
        </DialogTrigger>
      </Tooltip>
      <DialogOverlay className="z-[999999999999999999]" />
      <DialogContent  className=" z-[999999999999999999]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground/50">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
