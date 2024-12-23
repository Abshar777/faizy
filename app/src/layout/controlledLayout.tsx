import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { X } from "lucide-react";
import { onCloseApp } from "../lib/utils";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import AuthButton from "@/components/global/authButton";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const ControlledLayout = ({ children, className }: Props) => {
  const { user } = useUser();

  const [visible, setvisible] = useState(false);
  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event);
    setvisible(payload.state);
  });
  return (
    <div
      className={cn(
        visible && "invisible",
        className,
        " flex px-1 bg-primary rounded-xl relative z-[9999999999]  flex-col  overflow-hidden h-screen"
      )}
    >
      <div className="flex justify-between items-center px-5  ">
        <span className="non-draggable">
          {user ? <UserButton /> : <AuthButton />}
        </span>
        <div className=" draggable  w-full flex justify-center items-center">
          <Image src="/Faizy.svg" alt="Faizy" width={70} height={70} />
        </div>
        <Button
          isIconOnly
          variant="solid"
          className="hover:bg-transparent bg-transparent"
          onClick={onCloseApp}
        >
          <X className="cursor-pointer" onClick={onCloseApp} />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default ControlledLayout;
