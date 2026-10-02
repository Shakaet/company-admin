import { lazy } from "react";
import PrivateRoute from "../private-route/private.route";

const BannerList = lazy(() => import("@/app/pages/website/banner/banner-list"));
const HomeElementsPage = lazy(() => import("@/app/pages/website/home-elements/home-elements"));
const OurCompanyPage = lazy(() => import("@/app/pages/website/about/our-company"));
const OurTeamPage = lazy(() => import("@/app/pages/website/about/our-team"));
const FounderMessagePage = lazy(() => import("@/app/pages/website/about/founder-message"));
const ServicesListPage = lazy(() => import("@/app/pages/website/services/services-list"));
const ConsultationListPage = lazy(() => import("@/app/pages/website/services/consultation-list"));
const PortfolioPage = lazy(() => import("@/app/pages/portfolio/portfolio"));
const PricingPage = lazy(() => import("@/app/pages/pricing/pricing"));
const CareerPage = lazy(() => import("@/app/pages/career/career"));
const ContactListPage = lazy(() => import("@/app/pages/contact/contact-list"));

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
      {
        path: "website/about/company",
        element: <OurCompanyPage />,
      },
      {
        path: "website/about/team",
        element: <OurTeamPage />,
      },
      {
        path: "website/about/founder-message",
        element: <FounderMessagePage />,
      },
      {
        path: "services/all",
        element: <ServicesListPage />,
      },
      {
        path: "services/consultations",
        element: <ConsultationListPage />,
      },
      {
        path: "portfolio",
        element: <PortfolioPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "career",
        element: <CareerPage />,
      },
      {
        path: "contact",
        element: <ContactListPage />,
      },
    ],
  },
];

export default WebsiteRoutes;
