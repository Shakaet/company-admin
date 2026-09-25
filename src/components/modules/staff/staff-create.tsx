import { useGetRoles } from "@/api/role/role.api";
import { useCreateStaff, type CreateStaffPayload } from "@/api/staff/staff.api";
import FormCombo from "@/components/custom/form-combo";
import FormInput from "@/components/custom/form-input";
import FormSelect from "@/components/custom/form-select";
import PhonesInput from "@/components/custom/phone-input";
import StatusModal, { modalState } from "@/components/custom/status-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { statusOptions } from "@/helper/use-status-options";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type StaffCreateProps = {
  refetch: () => void;
  open: boolean;
  onClose: () => void;
};

const StaffCreate = ({ refetch, open, onClose }: StaffCreateProps) => {
  const { admin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(modalState);

  // ! create staff API
  const { mutateAsync: createStaff, isPending } = useCreateStaff();
  // ! fetch admin role API
  const { data: adminRoleData } = useGetRoles({ page: 1, limit: 9999 });

  // ! admin role options for select
  const adminRoleOptions =
    adminRoleData?.data?.map((r) => ({
      label: r.admin_role_name,
      value: r._id,
    })) || [];

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateStaffPayload>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  //! modal auto close after 5 sec
  useEffect(() => {
    if (!modal.open) return;

    const timer = setTimeout(() => {
      setModal((prev) => ({ ...prev, open: false }));
    }, 10000);
    return () => clearTimeout(timer);
  }, [modal.open]);

  useEffect(() => {
    if (open) {
      setValue("admin_status", "active");
      reset({
        admin_name: "",
        admin_phone: "",
        admin_password: "",
        admin_role_id: "",
        admin_status: "active",
      });
    }
  }, [open, setValue]);

  // !  submit form
  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        admin_role_id: data.admin_role_id,
        publisher_id: admin?._id,
      };

      await createStaff(payload);

      setModal({
        open: true,
        status: "success",
        title: "Staff Created Successfully",
        message: "Staff has been created successfully.",
      });

      reset({
        admin_name: "",
        admin_phone: "",
        admin_password: "",
      });
      refetch();
      setShowPassword(false);
      onClose();
    } catch (err: any) {
      setModal({
        open: true,
        status: "error",
        title: "Staff Creation Failed",
        message:
          err?.errorMessages[0].message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  // ! handle form submit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <section>
      <>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className={"text-xl"}>Create Admin</DialogTitle>
            </DialogHeader>

            <Card className="border-none shadow-none">
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleFormSubmit}>
                  <div className="">
                    {/* Admin Information */}
                    <h2 className="text-lg mb-3 font-medium">
                      Admin Information
                    </h2>
                    <div className="border p-5 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Admin Name */}
                        <div>
                          <FormInput
                            label="Admin Name"
                            name="admin_name"
                            placeholder="Enter admin name"
                            register={register}
                            error={errors.admin_name}
                            rules={{ required: "Admin name is required" }}
                            clearErrors={clearErrors}
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="admin_phone">Phone</Label>
                          <Controller
                            name="admin_phone"
                            control={control}
                            rules={{
                              required: "Phone number is required",
                              validate: (value) => {
                                if (!value.startsWith("+880"))
                                  return "Only Bangladesh number is allowed";
                                const digitsOnly = value.replace(/\D/g, "");
                                if (!/^8801[3-9]\d{8}$/.test(digitsOnly))
                                  return "Enter a valid Bangladesh phone number";
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
                          <Label htmlFor="admin_password">Password</Label>
                          <div className="relative">
                            <Input
                              id="admin_password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              className="pl-3 pr-10 py-3"
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
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                          {errors.admin_password && (
                            <p className="text-sm text-red-500">
                              {errors.admin_password.message}
                            </p>
                          )}
                        </div>

                        {/* Role */}
                        <div className="space-y-1 mt-1">
                          <Label>Select Role</Label>
                          <FormCombo
                            name="admin_role_id"
                            control={control}
                            options={adminRoleOptions}
                            placeholder="Select Role"
                            searchPlaceholder="Search role..."
                            rules={{ required: "Role is required" }}
                          />
                          {errors.admin_role_id && (
                            <p className="text-sm text-red-500">
                              {errors.admin_role_id.message}
                            </p>
                          )}
                        </div>

                        {/* Status — full width */}
                        <div className="md:col-span-2">
                          <FormSelect<CreateStaffPayload>
                            label="Status"
                            name="admin_status"
                            control={control}
                            options={statusOptions}
                            placeholder="Select a status"
                            error={errors.admin_status}
                            rules={{ required: "Status is required" }}
                            clearErrors={clearErrors}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-5">
                      <Button
                        type="submit"
                        className="w-full lg:w-fit px-10 py-3 text-base"
                        disabled={isPending}
                      >
                        {isPending ? "Creating..." : "Create Admin"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>

        {/* //? Status Modal */}
        <StatusModal
          open={modal.open}
          status={modal.status}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        />
      </>
    </section>
  );
};

export default StaffCreate;
