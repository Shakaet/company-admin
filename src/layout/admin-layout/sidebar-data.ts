import { LayoutDashboard, ShieldCheck, Users, Globe, ImagePlus } from "lucide-react";

export const sidebarMenu = [
  // DASHBOARD
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },

  // COMMISSION MANAGEMENT
  // {
  //   title: "Commission",
  //   url: "/commission",
  //   icon: Percent,
  //   permission: "admin_commission_show",
  // },

  // STAFF MANAGEMENT
  {
    title: "Staff Management",
    icon: Users,
    items: [
      {
        title: "All Staff",
        url: "/staff/all",
        icon: Users,
        permission: "admin_show",
      },
      {
        title: "Staff Roles",
        url: "/staff/roles",
        icon: ShieldCheck,
        permission: "admin_role_show",
      },
    ],
  },

  // WEBSITE MANAGEMENT
  {
    title: "Website Management",
    icon: Globe,
    items: [
      {
        title: "Banners",
        url: "/website/banners",
        icon: ImagePlus,
        permission: "banner_show",
      },
    ],
  },
];
