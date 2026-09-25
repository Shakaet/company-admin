import { useGetRoles } from "@/api/role/role.api";
import {
  useUpdateStaff,
  type IStaff,
  type UpdateStaffPayload,
} from "@/api/staff/staff.api";
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
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth-context";
import { statusOptions } from "@/helper/use-status-options";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type StaffUpdateProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  staffData: IStaff | null;
  refetch: () => void;
};

type StaffRoleOption = {
  label: string;
  value: string;
};

type StaffUpdateFormValues = {
  admin_name: string;
  admin_phone: string;
  admin_role_id: StaffRoleOption | null;
  admin_status: UpdateStaffPayload["admin_status"];
  admin_password: string;
};

const StaffUpdate = ({
  open,
  setOpen,
  staffData,
  refetch,
}: StaffUpdateProps) => {
  const { admin } = useAuth();
  const { mutateAsync: updateStaff, isPending } = useUpdateStaff();
  const { data: adminRoleData } = useGetRoles({ page: 1, limit: 9999 });

  const [modal, setModal] = useState(modalState);
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const adminRoleOptions: StaffRoleOption[] = useMemo(
    () =>
      adminRoleData?.data?.map((r) => ({
        label: r.admin_role_name,
        value: r._id,
      })) || [],
    [adminRoleData],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<StaffUpdateFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      admin_name: "",
      admin_phone: "+880",
      admin_role_id: null,
      admin_status: "active",
      admin_password: "",
    },
  });

  // ! auto close status modal
  useEffect(() => {
    if (!modal.open) return;

    const timer = setTimeout(() => {
      setModal((prev) => ({ ...prev, open: false }));
    }, 10000);

    return () => clearTimeout(timer);
  }, [modal.open]);

  // ! populate form on edit
  useEffect(() => {
    if (!open || !staffData) return;

    const roleId =
      typeof staffData.admin_role_id === "string"
        ? staffData.admin_role_id
        : staffData.admin_role_id?._id;

    const selectedRole =
      adminRoleOptions.find((r) => r.value === roleId) || null;

    reset({
      admin_name: staffData.admin_name || "",
      admin_phone: staffData.admin_phone || "+880",
      admin_role_id: selectedRole,
      admin_status: staffData.admin_status || "active",
      admin_password: "",
    });

    setChangePassword(false);
    setShowPassword(false);
  }, [open, staffData, adminRoleOptions, reset]);

  // ! close modal
  const closeModal = () => {
    setOpen(false);
    setChangePassword(false);
    setShowPassword(false);
    clearErrors();
    setValue("admin_password", "");
  };

  // ! submit form
  const onSubmit = async (data: StaffUpdateFormValues) => {
    if (!staffData?._id) return;

    try {
      const payload: UpdateStaffPayload = {
        _id: staffData._id,
        admin_name: data.admin_name,
        admin_status: data.admin_status,
        admin_role_id: data.admin_role_id?.value,
        admin_phone: staffData.admin_phone,
        updated_id: admin?._id,
      };

      if (changePassword && data.admin_password) {
        payload.admin_password = data.admin_password;
      }

      await updateStaff(payload);

      setModal({
        open: true,
        status: "success",
        title: "Staff Updated",
        message: "Staff has been updated successfully.",
      });

      refetch();
      closeModal();
    } catch (err: any) {
      setModal({
        open: true,
        status: "error",
        title: "Staff Update Failed",
        message:
          err?.errorMessages?.[0]?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <section>
      <>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) closeModal();
          }}
        >
          <DialogContent className="w-full min-w-[50%] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Update Admin</DialogTitle>
            </DialogHeader>

            <Card className="border-none shadow-none">
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-6">
                    {/* //? admin info */}
                    <div className="border p-5 rounded-md">
                      <h2 className="text-lg mb-3 font-medium">
                        Admin Information
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* //? admin name */}
                        <FormInput<StaffUpdateFormValues>
                          label="Admin Name"
                          name="admin_name"
                          placeholder="Enter admin name"
                          register={register}
                          error={errors.admin_name}
                          rules={{ required: "Admin name is required" }}
                          clearErrors={clearErrors}
                        />

                        {/* //? phone */}
                        <div className="space-y-2">
                          <Label htmlFor="admin_phone">Phone</Label>

                          <Controller
                            name="admin_phone"
                            control={control}
                            render={({ field }) => (
                              <PhonesInput
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.admin_phone}
                                readOnly
                                disabled
                              />
                            )}
                          />
                        </div>

                        {/* //? role select */}
                        <div className="space-y-1">
                          <Label>Select Role</Label>

                          <FormCombo<StaffUpdateFormValues>
                            name="admin_role_id"
                            control={control}
                            options={adminRoleOptions}
                            placeholder="Select Role"
                            searchPlaceholder="Search role..."
                            rules={{ required: "Role is required" }}
                          />

                          {errors.admin_role_id && (
                            <p className="text-sm text-red-500">
                              {errors.admin_role_id.message as string}
                            </p>
                          )}
                        </div>

                        {/* //? Status */}
                        <div className="space-y-1">
                          <FormSelect<StaffUpdateFormValues>
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

                    {/* //? PASSWORD */}
                    <div className="border p-5 rounded-md space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">
                            Change Password
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Enable only if you want to update password
                          </p>
                        </div>

                        <Switch
                          size="lg"
                          checked={changePassword}
                          onCheckedChange={(checked) => {
                            setChangePassword(checked);

                            if (!checked) {
                              setValue("admin_password", "");
                              clearErrors("admin_password");
                              setShowPassword(false);
                            }
                          }}
                        />
                      </div>

                      {changePassword && (
                        <div className="space-y-2">
                          <Label htmlFor="admin_password">New Password</Label>

                          <div className="relative">
                            <Input
                              id="admin_password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="pl-3 pr-10 py-5"
                              {...register("admin_password", {
                                validate: (value) => {
                                  if (!changePassword) return true;
                                  if (!value) return "Password is required";
                                  if (value.length < 6)
                                    return "Minimum 6 characters required";
                                  return true;
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
                      )}
                    </div>

                    {/* //? submit */}
                    <div className="flex items-center justify-end">
                      <Button
                        type="submit"
                        className="w-full lg:w-fit px-10 py-3 text-base"
                        disabled={isPending}
                      >
                        {isPending ? "Updating..." : "Update Admin"}
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

export default StaffUpdate;
