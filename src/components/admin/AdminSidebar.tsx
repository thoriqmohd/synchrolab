import { Building2, CalendarCheck, Mail, MapPin, LogOut, Users, GraduationCap, DoorOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { title: "Tempahan", url: "/admin/bookings", icon: CalendarCheck },
  { title: "Kursus", url: "/admin/courses", icon: GraduationCap },
  { title: "Bilik", url: "/admin/rooms", icon: DoorOpen },
  { title: "Pengguna", url: "/admin/users", icon: Users },
  { title: "Anjur Kursus", url: "/admin/host-requests", icon: Building2 },
  { title: "Senarai Tempat", url: "/admin/venue-listings", icon: MapPin },
  { title: "Hubungi Kami", url: "/admin/contact-messages", icon: Mail },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4">
        {!collapsed && (
          <div>
            <p className="font-display text-lg font-bold text-foreground">SynchroLab</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pengurusan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-2"
                        activeClassName="bg-muted text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Log Keluar</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
