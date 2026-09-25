import { lazy } from "react";
import { Navigate } from "react-router-dom";
const RolePage = lazy(() => import("@/app/pages/settings/role/role-page"));
const StaffPage = lazy(() => import("@/app/pages/settings/staff/staff-page"));

const StaffRoutes = [
  {
    path: "staff",
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "all",
        element: <StaffPage />,
        handle: { title: "Admin" },
      },

      // !roles routes
      {
        path: "roles",
        element: <RolePage />,
        handle: { title: "Roles" },
      },
    ],
  },
];

export default StaffRoutes;
