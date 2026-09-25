import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { useCreateRole } from "@/api/role/role.api";
import PermissionData from "@/data/permission-data";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Field from "../../custom/field";
import StatusModal, { modalState } from "../../custom/status-modal";

const RoleCreate = ({
  refetch,
  open,
  onClose,
  admin,
}: {
  refetch: () => void;
  open: boolean;
  onClose: (open: boolean) => void;
  admin: any;
}) => {
  // //! create merchant role API
  const { mutateAsync: createRole, isPending } = useCreateRole();
  const [modal, setModal] = useState(modalState);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<{
    admin_role_name: string;
    permissions: string[];
    publisher_id?: string;
  }>({
    defaultValues: {
      admin_role_name: "",
      permissions: [],
      publisher_id: admin?._id,
    },
  });

  //! Status modal auto close

  useEffect(() => {
    if (!modal.open) return;

    const timer = setTimeout(() => {
      setModal((prev) => ({ ...prev, open: false }));
    }, 8000);

    return () => clearTimeout(timer);
  }, [modal.open]);

  //! Dialog open / close handler

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset({
        admin_role_name: "",
        permissions: [],
      });
    }
    onClose(isOpen);
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

  const onSubmit = async (data: any) => {
    try {
      if (!data.permissions.length) {
        return setModal({
          open: true,
          status: "error",
          title: "Validation Error",
          message: "Please select at least one permission",
        });
      }

      await createRole({
        admin_role_name: data.admin_role_name,
        admin_role_status: "active",
        permissions: data.permissions,
        publisher_id: admin?._id,
      });

      setModal({
        open: true,
        status: "success",
        title: "Role Created",
        message: "Role created successfully",
      });

      reset({
        admin_role_name: "",
        permissions: [],
      });

      refetch();
      onClose(false);
    } catch (err: any) {
      setModal({
        open: true,
        status: "error",
        title: "Failed",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="min-w-[85%] max-h-[90vh] overflow-y-auto scrollbar-hide ">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Role</DialogTitle>
          </DialogHeader>

          <Card className="border-none shadow-none">
            <CardContent className="px-4 sm:px-6 space-y-6">
              {/* //? ROLE INFO */}
              <div className="border p-4 sm:p-5 rounded-md">
                <h2 className="text-lg mb-3 font-medium">Role Information</h2>

                <Field
                  label="Role Name"
                  required
                  error={errors.admin_role_name}
                >
                  <Input
                    placeholder="Super Admin"
                    {...register("admin_role_name", {
                      required: "Role Name is required",
                    })}
                  />
                </Field>
              </div>

              {/* //? PERMISSIONS */}
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
                              {/* //? Left */}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {perm.type_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {perm.description ||
                                    "Permission access control"}
                                </span>
                              </div>

                              {/* //? Right */}
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

              {/* //? SUBMIT */}
              <div className="flex justify-end">
                <Button
                  className="w-full lg:w-fit px-10 py-3 text-base"
                  disabled={isPending}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isPending ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* //? STATUS MODAL */}
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

export default RoleCreate;
