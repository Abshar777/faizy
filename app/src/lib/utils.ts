import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const onCloseApp = () => window.ipcRenderer.send('close-window')

export const onOpenApp = () => window.ipcRenderer.send('open-app', {state: false})