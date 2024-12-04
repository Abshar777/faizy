"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import FolderDuotone from "@/components/icons/folder-duotone";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import { Input } from "@/components/ui/input";
import { useMutationData } from "@/hooks/useMutation";
import { renameFolders } from "../../../../actions/workspace";
import capitalizeWords from "@/util/captilizeString";

interface Props {
  name: string;
  id: string;
  optimistic?: boolean;
  count?: number;
}

const Folder = ({ name, id, optimistic=false, count }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [onRename, setOnRename] = useState(false);
  const [value, setValue] = useState(name);

  const Rename = () => setOnRename(true);
  const Renamed = () => setOnRename(false);
  const { mutate, isPending } = useMutationData(
    ["renamee-folders"],
    (data: { name: string }) => renameFolders(id, data.name),
    "workspace-folders",
    Renamed
  );

  const updateFolderName = (name: string) => {
    if (name.trim() !== "") {
     
      mutate({ name: capitalizeWords(name,"-") });
    }
    Renamed();
  };

  const handleclick = () => {
    if (onRename) return;
    router.push(`${pathname}/folder/${id}`);
  };
  const dblclick = (e: React.MouseEvent<HTMLDivElement>) => {
    Rename();
    e.stopPropagation();
    inputRef.current?.focus();
    setValue(name);
    inputRef.current?.select();
    
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.currentTarget.value.trim() !== "")
        updateFolderName(e.currentTarget.value);
    } else if (e.key === " ") {
      e.preventDefault();
      const cursorPosition = e.currentTarget.selectionStart;
      const value = e.currentTarget.value;
      e.currentTarget.value =
        value.slice(0, cursorPosition as number) +
        "-" +
        value.slice(cursorPosition as number);
      e.currentTarget.setSelectionRange(
        (cursorPosition as number) + 1,
        (cursorPosition as number) + 1
      );
    }
  };
  return (
    <Button
    allowTextSelectionOnPress
      disabled={optimistic}
      isLoading={isPending}
      size="md"
      onClick={handleclick}
      className={cn(optimistic&&"opacity-50",
        "flex   hover:bg-muted-foreground/10 py-8 px-4 ring-white  bg-muted-foreground/5 cursor-pointer transition duration-150  justify-between min-w-[250px] max-w-[250px]   rounded-lg  border-[1px] items-center gap-2"
      )}
    >
      <div className="w-full   bg-transparent flex justify-between">
        <div
          onDoubleClick={dblclick}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-start"
        >
            
          {onRename ? (
            <>
              <Input
                onBlur={(e) => updateFolderName(e.target.value)}
                onKeyDown={handleKeyDown}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus={true}
                placeholder={inputRef.current?.value}
                className=" text-base border-none capitalize h-fit rounded-none  w-full p-0 outline-none text-neutral-300 bg-transparent "
                ref={inputRef}
              />
            </>
          ) : (
            <>
              <p className="text-sm ">{value}</p>
            </>
          )}
          <span className="text-xs text-muted-foreground">{count} files</span>
        </div>
        <FolderDuotone />
      </div>
    </Button>
  );
};

export default Folder;
