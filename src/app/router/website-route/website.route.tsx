import { lazy } from "react";
import PrivateRoute from "../private-route/private.route";

const BannerList = lazy(() => import("@/app/pages/website/banner/banner-list"));

const WebsiteRoutes = [
  {
    element: <PrivateRoute allowedRoles={["admin"]} loginPath="/auth/login" />,
    children: [
      {
        path: "website/banners",
        element: <BannerList />,
      },
    ],
  },
];

export default WebsiteRoutes;
