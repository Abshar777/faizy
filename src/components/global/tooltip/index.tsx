import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface Props {
    trigger: React.ReactNode;
    content: React.ReactNode;       
    side?: "top" | "bottom" | "left" | "right";
}

const TooltipUI = ({trigger, content, side="bottom"}: Props) => {
  return (
   
      <Tooltip >
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent className="bg-muted-foreground/20 backdrop-blur-md text-secondary-foreground" side={side}>
          {content}
        </TooltipContent>
      </Tooltip>
  
  );
};

export default TooltipUI;
