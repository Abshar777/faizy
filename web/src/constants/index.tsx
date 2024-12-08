import {
  Bell,
  CreditCard,
  FileDuoToneBlack,
  Home,
  Settings,
} from '@/components/icons'

export const MENU_ITEMS = (
  workspaceId: string
): { title: string; name: string; href: string; icon: React.ReactNode }[] => [
  { title: 'Home', name: "home", href: `/dashboard/${workspaceId}/home`, icon: <Home /> },
  {
    title: 'My Library',
    name: "library",
    href: `/dashboard/${workspaceId}`,
    icon: <FileDuoToneBlack />,
  },
  {
    title: 'Notifications',
    name: "notifications",
    href: `/dashboard/${workspaceId}/notifications`,
    icon: <Bell />,
  },
  {
    title: 'Billing',
    name: "billing",
    href: `/dashboard/${workspaceId}/billing`,
    icon: <CreditCard />,
  },
  {
    title: 'Settings',
    name: "settings",
    href: `/dashboard/${workspaceId}/settings`,
    icon: <Settings />,
  },
]
