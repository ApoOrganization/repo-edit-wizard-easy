
import { Calendar, BarChart3, Users, MapPin, Building2, Grid } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/brand";

const items = [
  { title: "Dashboard", url: "/", icon: Grid },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Artists", url: "/artists", icon: Users },
  { title: "Venues", url: "/venues", icon: Building2 },
  { title: "Promoters", url: "/promoters", icon: MapPin },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarContent className="p-0">
        {/* Brand Header */}
        <div className="flex items-center px-6 py-4">
          {!collapsed ? (
            <Logo 
              variant="main" 
              size="md" 
              showName={true}
              className="text-sidebar-foreground"
            />
          ) : (
            <Logo 
              variant="icon" 
              size="sm"
              className="text-sidebar-foreground"
            />
          )}
        </div>

        <SidebarGroup className="px-3 py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: navIsActive }) => {
                        const active = isActive(item.url);
                        return `flex items-center px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`;
                      }}
                    >
                      <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                      {!collapsed && (
                        <span>{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
