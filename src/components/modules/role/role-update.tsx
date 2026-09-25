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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useUpdateRole } from "@/api/role/role.api";
import PermissionData from "@/data/permission-data";
import type { Status } from "@/interface/common-interface";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Field from "../../custom/field";

interface RoleUpdateFormValues {
  admin_role_name: string;
  permissions: string[];
  admin_role_status: Status;
  updated_id?: string;
}

interface RoleUpdateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  roleData: {
    _id: string;
    admin_role_name: string;
    permissions: string[];
    admin_role_status: Status;
  } | null;
  refetch: () => void;
  admin: {
    _id?: string;
  } | null;
}

const RoleUpdate = ({
  open,
  setOpen,
  roleData,
  refetch,
  admin,
}: RoleUpdateProps) => {
  //! update role API
  const { mutateAsync: updateRole, isPending } = useUpdateRole();

  const [modal, setModal] = useState(modalState);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<RoleUpdateFormValues>({
    defaultValues: {
      admin_role_name: "",
      permissions: [],
      admin_role_status: "active",
      updated_id: admin?._id,
    },
  });

  //! Prefill data on open
  useEffect(() => {
    if (open && roleData) {
      reset({
        admin_role_name: roleData.admin_role_name || "",
        permissions: roleData.permissions || [],
        admin_role_status: roleData.admin_role_status || "active",
        updated_id: admin?._id,
      });
    }
  }, [open, roleData, reset, admin?._id]);

  //! Dialog close handler
  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset({
        admin_role_name: "",
        permissions: [],
        admin_role_status: "active",
        updated_id: admin?._id,
      });
    }
    setOpen(isOpen);
  };

  //! Permission logic
  const selectedPermissions = watch("permissions") || [];

  const togglePermission = (value: string) => {
    setValue(
      "permissions",
      selectedPermissions.includes(value)
        ? selectedPermissions.filter((p) => p !== value)
        : [...selectedPermissions, value],
      { shouldValidate: true },
    );
  };

  //! Submit
  const onSubmit = async (data: RoleUpdateFormValues) => {
    try {
      if (!data.permissions.length) {
        return setModal({
          open: true,
          status: "error",
          title: "Validation Error",
          message: "Please select at least one permission",
        });
      }

      if (!roleData?._id) {
        return setModal({
          open: true,
          status: "error",
          title: "Missing Role ID",
          message: "Role ID not found",
        });
      }

      await updateRole({
        _id: roleData._id,
        admin_role_name: data.admin_role_name,
        permissions: data.permissions,
        admin_role_status: data.admin_role_status,
        updated_id: admin?._id,
      });

      setModal({
        open: true,
        status: "success",
        title: "Role Updated",
        message: "Role updated successfully",
      });

      refetch();
      setOpen(false);
    } catch (err: any) {
      setModal({
        open: true,
        status: "error",
        title: "Update Failed",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="min-w-[70%] max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Role</DialogTitle>
          </DialogHeader>

          <Card className="border-none shadow-none">
            <CardContent className="px-4 sm:px-6 space-y-6">
              {/* ROLE INFO */}
              <div className="border p-4 sm:p-5 rounded-md">
                <h2 className="text-lg mb-3 font-medium">Role Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <Field
                    label="Role Name"
                    required
                    error={errors.admin_role_name}
                  >
                    <Input
                      placeholder="Role Name"
                      {...register("admin_role_name", {
                        required: "Role Name is required",
                      })}
                      className="w-full"
                    />
                  </Field>

                  <Field
                    label="Role Status"
                    required
                    error={errors.admin_role_status}
                  >
                    <Controller
                      name="admin_role_status"
                      control={control}
                      rules={{ required: "Role Status is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value: Status) =>
                            field.onChange(value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="in-active">In Active</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              </div>

              {/* PERMISSIONS */}
              <div className="border p-4 sm:p-6 rounded-md">
                <h2 className="text-lg mb-6 font-medium">Permissions</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PermissionData.map((group) => (
                    <div
                      key={group.Name}
                      className="rounded-md border bg-background p-4"
                    >
                      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
                        {group.Name}
                      </h3>

                      <div className="flex flex-col gap-3">
                        {group.Type.map((perm) => {
                          const checked = selectedPermissions.includes(
                            perm.type_value,
                          );

                          return (
                            <div
                              key={perm.type_value}
                              className={cn(
                                "flex items-start justify-between gap-4 rounded-md p-3 transition-colors",
                                checked ? "bg-muted/50" : "hover:bg-muted/30",
                              )}
                            >
                              {/* Left */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {perm.type_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {perm.description ||
                                    "Permission access control"}
                                </span>
                              </div>

                              {/* Right */}
                              <Switch
                                size="lg"
                                checked={checked}
                                onCheckedChange={() =>
                                  togglePermission(perm.type_value)
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end">
                <Button
                  className="w-full lg:w-fit px-10 py-3 text-base"
                  disabled={isPending}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isPending ? "Updating..." : "Update Role"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* STATUS MODAL */}
      <StatusModal
        open={modal.open}
        status={modal.status as "success" | "error"}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </section>
  );
};

export default RoleUpdate;
