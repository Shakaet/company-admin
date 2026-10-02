import { lazy } from "react";
import PrivateRoute from "../private-route/private.route";

const BannerList = lazy(() => import("@/app/pages/website/banner/banner-list"));
const HomeElementsPage = lazy(() => import("@/app/pages/website/home-elements/home-elements"));

const WebsiteRoutes = [
  {
    element: <PrivateRoute allowedRoles={["admin"]} loginPath="/auth/login" />,
    children: [
      {
        path: "website/banners",
        element: <BannerList />,
      },
      {
        path: "website/home-elements",
        element: <HomeElementsPage />,
      },
    ],
  },
];

export default WebsiteRoutes;
