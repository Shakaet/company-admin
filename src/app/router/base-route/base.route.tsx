import AdminLayout from "@/layout/admin-layout/admin-layout";
import AuthLayout from "@/layout/auth-layout/auth-layout";
import RootLayout from "@/layout/root-layout/root-layout";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardRoutes from "../admin-route/admin.route";
import AuthRoute from "../auth-route/auth.route";
import PrivateRoute from "../private-route/private.route";
import StaffRoutes from "../staff-route/staff.route";
const NotFound = lazy(() => import("@/app/pages/not-found/not-found"));
const Unauthorized = lazy(
  () => import("@/app/pages/unauthorized/Unauthorized"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // !auth routes
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [...AuthRoute],
      },
      // !merchant routes
      {
        element: (
          <PrivateRoute allowedRoles={["admin"]} loginPath="/auth/login" />
        ),
        children: [
          {
            path: "/",
            element: <AdminLayout />,
            children: [
              ...DashboardRoutes,
              ...StaffRoutes,
            ],
          },
        ],
      },
      //   //! redirect root to dashboard
      //   {
      //     index: true,
      //     element: <RootRedirect />,
      //   },
      // !not found
      {
        path: "*",
        element: <NotFound />,
        handle: {
          title: "Not Found",
        },
      },
      // !unauthorized
      {
        path: "/unauthorized",
        element: <Unauthorized />,
        handle: {
          title: "Unauthorized",
        },
      },
    ],
  },
]);

export default router;
