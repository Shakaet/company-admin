import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("@/app/pages/dashboard/dashboard"));

const DashboardRoutes = [
  {
    path: "",
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        handle: { title: "Admin Dashboard" },
      },

      // !settings routes
      {
        path: "settings",
        element: <div className="bg-gray-100 p-4">Settings</div>,
        handle: { title: "Settings" },
      },
    ],
  },
];

export default DashboardRoutes;
