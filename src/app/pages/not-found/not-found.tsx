import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-foreground">404</h1>

      <p className="mt-4 text-lg text-muted-foreground max-w-md">
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </p>

      <div className="mt-8 flex gap-4">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Go Back
        </Button>

        {/* Home Button */}
        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home size={16} />
          Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
