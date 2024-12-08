'use client'
import { enableFirstView, getFirstView } from '@/actions/user'
import { DarkMode } from '@/components/theme/dark.mode'
import { LightMode } from '@/components/theme/light-mode'
import { SystemMode } from '@/components/theme/system-mode'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const SettingsPage = () => {
  const [firstView, setFirstView] = useState<undefined | boolean>(undefined)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    if (firstView !== undefined) return
    const fetchData = async () => {
      const response = await getFirstView()
      if (response.status === 200) setFirstView(response?.data)
    }
    fetchData()
  }, [firstView])

  const switchState = async (checked: boolean) => {
    const view = await enableFirstView(checked)
    if (view) {
      toast.info("setting updated", {
        description: view.data,
      })
    }
  }

  return (
    <div className="bg-muted-foreground/5 px-4 py-5 rounded-lg">
      <div className="grid grid-cols-5 lg:gap-10 gap-0">
        {/* <div className="flex  md:flex-row flex-col w-full   items-start gap-5">
          <div
            className={cn(
              'rounded-2xl min-w-[15rem] lg:scale-[1] md:scale-[0.8] overflow-hidden cursor-pointer border-4 border-transparent',
              theme == 'system' && 'border-purple-800'
            )}
            onClick={() => setTheme('system')}
          >
            <SystemMode />
          </div>
          <div
            className={cn(
              'rounded-2xl min-w-[15rem] lg:scale-[1] md:scale-[0.8] overflow-hidden cursor-pointer border-4 border-transparent',
              theme == 'light' && 'border-purple-800'
            )}
            onClick={() => setTheme('light')}
          >
            <LightMode />
          </div>
          <div
            className={cn(
              'rounded-2xl min-w-[15rem] lg:scale-[1] md:scale-[0.8] overflow-hidden cursor-pointer border-4 border-transparent',
              theme == 'dark' && 'border-purple-800'
            )}
            onClick={() => setTheme('dark')}
          >
            <DarkMode />
          </div>
        </div> */}
      </div>
      <h2 className="text-lg font-semibold ">Video Sharing Settings</h2>
      <p className="text-muted-foreground text-sm">
        Enabling this feature will send you notifications when someone watched
        your video for the first time. This feature can help during client
        outreach.
      </p>
      <Label className="flex items-center mt-2 gap-x-3  text-md">
        Enable First View
        <Switch
          onCheckedChange={switchState}
          disabled={firstView === undefined}
          checked={firstView}
          onClick={() => setFirstView(!firstView)}
        />
      </Label>
    </div>
  )
}

export default SettingsPage
