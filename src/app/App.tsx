import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import QueryProvider from "@/provider/query-provider";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./router/base-route/base.route";
import { ThemeProvider } from "next-themes";

const App = () => {
  return (
    <section>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster
                richColors
                expand
                toastOptions={{
                  style: {
                    zIndex: 9999,
                  },
                }}
              />
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center">
                    <Spinner className="size-6" />
                  </div>
                }
              >
                <RouterProvider router={router} />
              </Suspense>
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </section>
  );
};

export default App;
