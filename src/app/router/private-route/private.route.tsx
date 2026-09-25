import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles?: string[];
  loginPath: string;
}

const PrivateRoute = ({ allowedRoles = [], loginPath }: PrivateRouteProps) => {
  const { isAdminAuthenticated, adminRole, adminLoading } = useAuth();
  const location = useLocation();

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button variant="outline" disabled size="sm">
          <Spinner />
          Loading...
        </Button>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <Navigate to={loginPath} state={{ from: location.pathname }} replace />
    );
  }

  if (!allowedRoles.includes(adminRole || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
