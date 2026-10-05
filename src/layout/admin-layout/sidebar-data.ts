import { LayoutDashboard, ShieldCheck, Users, Globe, ImagePlus, Info, Building2, UserCircle, MessageSquare, Layers, DollarSign, Briefcase, Settings } from "lucide-react";

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
      {
        title: "Home Elements",
        url: "/website/home-elements",
        icon: Globe,
        permission: "home_show",
      },
      {
        title: "Site Settings",
        url: "/website/site-setting",
        icon: Settings,
        permission: "site_setting_show",
      },
    ],
  },
  
  // SERVICES MANAGEMENT
  {
    title: "Services Management",
    icon: Building2,
    items: [
      {
        title: "All Services",
        url: "/services/all",
        icon: UserCircle,
        permission: "service_show",
      },
      {
        title: "Consultations",
        url: "/services/consultations",
        icon: MessageSquare,
        permission: "service_show",
      },
    ],
  },
  
  // ABOUT MANAGEMENT
  {
    title: "About Us",
    icon: Info,
    items: [
      {
        title: "Our Company",
        url: "/website/about/company",
        icon: Building2,
        permission: "about_show",
      },
      {
        title: "Our Team",
        url: "/website/about/team",
        icon: UserCircle,
        permission: "about_show",
      },
      {
        title: "Founder Message",
        url: "/website/about/founder-message",
        icon: MessageSquare,
        permission: "about_show",
      },
    ],
  },

  // PORTFOLIO MANAGEMENT
  {
    title: "Portfolio",
    icon: Layers,
    items: [
      {
        title: "Projects",
        url: "/portfolio",
        icon: Layers,
        permission: "portfolio_show",
      },
    ],
  },

  // PRICING MANAGEMENT
  {
    title: "Pricing",
    icon: DollarSign,
    items: [
      {
        title: "Plans & Guarantees",
        url: "/pricing",
        icon: DollarSign,
        permission: "pricing_show",
      },
    ],
  },

  // CAREER MANAGEMENT
  {
    title: "Career",
    icon: Briefcase,
    items: [
      {
        title: "Job Posts & Applications",
        url: "/career",
        icon: Briefcase,
        permission: "career_show",
      },
    ],
  },

  // CONTACT MANAGEMENT
  {
    title: "Contact Submissions",
    url: "/contact",
    icon: MessageSquare,
    permission: "contact_show",
  },
];
