import { lazy } from "react";

const LoginPage = lazy(() => import("@/app/pages/auth/login/login"));

const AuthRoute = [
  {
    path: "",
    children: [
      {
        path: "login",
        element: <LoginPage />,
        handle: {
          title: "Admin Login",
        },
      },
    ],
  },
];

export default AuthRoute;
