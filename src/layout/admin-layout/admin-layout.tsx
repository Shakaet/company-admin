import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { useBreadcrumbs } from "@/hooks/use-bread-crumbs";
import { useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./admin-sidebar";

const AdminContent = () => {
  const { pathname } = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const { admin, adminLogout } = useAuth();
  const { state, setOpen } = useSidebar();
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    const isPosRoute = pathname.startsWith("/pos");
    const wasPosRoute = previousPathRef.current.startsWith("/pos");

    if (isPosRoute && !wasPosRoute) {
      setOpen(false);
    }

    previousPathRef.current = pathname;
  }, [pathname, setOpen]);

  const { can } = useAdminPermission();

  const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground hover:text-foreground"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };

  return (
    <SidebarInset className="min-w-0 flex-1 overflow-y-auto px-5">
      {/* Header - Fixed positioned with dynamic left positioning */}
      <header
        className=" fixed top-0 right-0 z-10 flex h-16 items-center justify-between px-4 lg:px-9 bg-background border-b backdrop-blur supports-backdrop-filter:bg-background/95 transition-all duration-300"
        style={{
          left:
            window.innerWidth >= 1024
              ? state === "expanded"
                ? "var(--sidebar-width)"
                : "var(--sidebar-width-icon)"
              : "0px",
        }}
      >
        {/* LEFT: breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-8"
          />

          <Breadcrumb className="overflow-hidden">
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <div key={item.href} className="flex items-center gap-1">
                  {index !== 0 && (
                    <BreadcrumbSeparator className="hidden sm:block" />
                  )}
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage className="line-clamp-1">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.href} className="line-clamp-1">
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* RIGHT: admin profile */}
        <div className="mr-2 flex items-center gap-2">
          {/* {can("admin_pos_order_create") && (
            <Link to="/pos/orders-create">
              <Button size="lg" variant={"outline"} className="rounded-sm">
                <PosIcon className="mr-2 h-5 w-5" />
                POS
              </Button>
            </Link>
          )} */}

          <DropdownMenu>
              {/* Dark Mode Toggle */}
              <ThemeToggle />
            <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer shrink-0 ml-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={admin?.restaurant_id?.restaurant_logo}
                  alt={admin?.admin_name}
                />
                <AvatarFallback>{admin?.admin_name?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-medium line-clamp-1 capitalize">
                  {admin?.admin_name}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {admin?.admin_phone}
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link to="/website/settings" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={adminLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Outlet wrapper */}
      <main className="flex flex-col gap-4 p-4 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </SidebarInset>
  );
};

const AdminLayout = () => {
  return (
    <main className="flex-1 w-full overflow-x-hidden">
      <SidebarProvider>
        {/* app side bar */}

        <AdminSidebar />

        {/* Main Content with useSidebar hook */}
        <AdminContent />
      </SidebarProvider>
    </main>
  );
};

export default AdminLayout;
