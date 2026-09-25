import PhonesInput from "@/components/custom/phone-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginForm {
  admin_phone: string;
  admin_password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      admin_phone: "+880",
      admin_password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      setLoading(true);
      await loginAdmin(data);
      toast.success("Login successful");
      navigate(location?.state?.from?.pathname || "/", { replace: true });
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error?.message || "Login failed",
      });
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col px-4">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-white">Raadiall Logo</div>
      </div>

      <Card className="w-full max-w-md shadow-lg bg-foreground">
        <h1 className="text-white text-center text-xl font-semibold pt-6">
          Login to your account
        </h1>

        <CardContent className="pt-4 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="admin_phone" className="text-white">
                Phone
              </Label>

              <Controller
                name="admin_phone"
                control={control}
                rules={{
                  required: "Phone number is required",
                  validate: (value) => {
                    if (!value.startsWith("+880")) {
                      return "Only Bangladesh number is allowed";
                    }

                    const digitsOnly = value.replace(/\D/g, "");

                    if (!/^8801[3-9]\d{8}$/.test(digitsOnly)) {
                      return "Enter a valid Bangladesh phone number";
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <PhonesInput
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.admin_phone}
                  />
                )}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="admin_password" className="text-white">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="admin_password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="bg-white text-black pl-3 pr-10 py-5"
                  {...register("admin_password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.admin_password && (
                <p className="text-sm text-white">
                  {errors.admin_password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-white text-primary hover:bg-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
