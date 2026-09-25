import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { isRouteActive } from "@/helper/active-route";
import { hasAdminPermission } from "@/helper/has-admin-permission";
import { cn } from "@/lib/utils";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarMenu } from "./sidebar-data";

type SiteSettingsType = {
  logo?: string;
  title?: string;
};

type PermissionType = string;

type AdminType = {
  admin_role_id?: {
    permissions?: PermissionType[];
  };
};

type SidebarSubItem = {
  title: string;
  url: string;
  permission?: string;
  icon?: LucideIcon;
};

type SidebarItem = {
  title: string;
  url?: string;
  permission?: string;
  icon: LucideIcon;
  items?: SidebarSubItem[];
};

interface AdminSidebarProps {
  siteSettings?: SiteSettingsType;
}

const AdminSidebar = ({ siteSettings }: AdminSidebarProps) => {
  const { admin } = useAuth() as {
    admin: AdminType | null;
  };

  const adminPermission = admin?.admin_role_id?.permissions ?? [];
  const { pathname } = useLocation();
  const { state, setOpen } = useSidebar();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="group">
      {/* HEADER */}
      <SidebarHeader className="flex justify-center px-1 py-3 text-lg font-semibold">
        {isCollapsed ? (
          <img
            src={siteSettings?.logo || "/classic.png"}
            alt={siteSettings?.title || "Logo"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div>
            <img
              src={siteSettings?.logo || "/classic.png"}
              alt={siteSettings?.title || "Logo"}
              className="h-40 w-full object-contain"
            />
          </div>
        )}
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="scrollbar-hide px-1">
        <nav className="space-y-1">
          {(sidebarMenu as SidebarItem[]).map((item, index) => {
            const Icon = item.icon;
            const isActive = isRouteActive(pathname, item);

            if (item.items?.length) {
              const allowedSubItems = item.items.filter((sub) =>
                hasAdminPermission(adminPermission, sub.permission || ""),
              );

              if (!allowedSubItems.length) return null;

              return (
                <TooltipProvider key={index} delayDuration={0}>
                  <Tooltip open={isCollapsed ? undefined : false}>
                    <details
                      open={!isCollapsed && (openIndex === index || isActive)}
                      className="group/details"
                    >
                      <TooltipTrigger asChild>
                        <summary
                          onClick={(e) => {
                            if (isCollapsed) {
                              e.preventDefault();
                              setOpen(true);
                              return;
                            }

                            e.preventDefault();

                            setOpenIndex((prev) =>
                              prev === index ? null : index,
                            );
                          }}
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors",
                            "hover:bg-primary/80 hover:text-primary-foreground",
                            (openIndex === index || isActive) && "font-medium",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>

                          {!isCollapsed && (
                            <ChevronDown className="h-4 w-4 transition-transform group-open/details:rotate-180" />
                          )}
                        </summary>
                      </TooltipTrigger>

                      {/* Tooltip (collapsed only) */}
                      {isCollapsed && (
                        <TooltipContent side="right" align="center">
                          {item.title}
                        </TooltipContent>
                      )}

                      {/* Nested routes */}
                      {!isCollapsed && (
                        <div className="ml-6 mt-1 space-y-1">
                          {allowedSubItems.map((sub, i) => {
                            const SubIcon = sub.icon;

                            return (
                              <NavLink
                                key={i}
                                to={sub.url}
                                end
                                className={({ isActive }) =>
                                  cn(
                                    "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors",
                                    "hover:bg-primary/80 hover:text-primary-foreground",
                                    isActive &&
                                      "bg-primary font-medium text-white",
                                  )
                                }
                              >
                                {SubIcon && (
                                  <SubIcon className="h-4 w-4 shrink-0" />
                                )}
                                <span>{sub.title}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </details>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            if (!hasAdminPermission(adminPermission, item.permission || ""))
              return null;

            return (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip open={isCollapsed ? undefined : false}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.url || "#"}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                        "hover:bg-primary/80 hover:text-primary-foreground",
                        isActive && "bg-primary font-medium text-white",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </TooltipTrigger>

                  {/* Tooltip (collapsed only) */}
                  {isCollapsed && (
                    <TooltipContent side="right" align="center">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
