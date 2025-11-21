  "use client"

  import * as React from "react"
  import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command, Database,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal, Users,
} from "lucide-react"

  import { NavMain } from "@/components/nav-main"
  import { NavProjects } from "@/components/nav-projects"
  import { NavUser } from "@/components/nav-user"
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
  } from "@/components/ui/sidebar"
  import {SidebarThemeSwitcher} from "@/components/ModeToggle";

  // This is sample data.
  const data = {
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Tenant",
        url: "/tenant",
        icon: Database,
        isActive: true,
        items: [
          {
            title: "Management",
            url: "/tenant/manage",
          },
          {
            title: "Migration",
            url: "/tenant/migration",
          }
        ],
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
        isActive: true,
        items: [
          {
            title: "Management",
            url: "/users/manage",
          },
          {
            title: "Refresh Tokens",
            url: "/users/refresh-tokens",
          }
        ],
      },
    ],
    projects: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: Users,
      },
    ],
  }

  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <NavUser/>
        </SidebarHeader>
        <SidebarContent>
          <NavProjects projects={data.projects} />
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarThemeSwitcher />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }
