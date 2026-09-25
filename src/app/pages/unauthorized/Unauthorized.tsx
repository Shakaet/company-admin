import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogout } = useAuth();

  const fromPath = location.state?.from;

  const handleLogout = async () => {
    if (!fromPath) {
      await adminLogout();
      navigate("/", { replace: true });
      return;
    }

    if (fromPath.startsWith("/admin")) {
      await adminLogout();
      navigate("/admin/auth/login", { replace: true });
      return;
    }

    if (fromPath.startsWith("/merchant")) {
      navigate("/merchant/auth/login", { replace: true });
      return;
    }

    await adminLogout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogout();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Access Denied
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            You do not have permission to access this page. Redirecting to
            login...
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
