import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import PermissionData from "@/data/permission-data";

import { cn } from "@/lib/utils";

const ViewPermission = ({
  open,
  setOpen,
  viewData = [],
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  viewData: any;
}) => {
  if (!viewData) return null;
  const { merchant_admin_role_name, permissions = [] } = viewData;

  return (
    <section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[85%] max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-xl">Role Permissions</DialogTitle>
          </DialogHeader>

          <Card className="border-none shadow-none">
            <CardContent className="px-4 sm:px-6 space-y-6">
              {/* //? ROLE INFO */}
              <div className="border p-4 sm:p-5 rounded-md">
                <h2 className="text-lg font-medium mb-1 capitalize">
                  {merchant_admin_role_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Assigned permissions for this role
                </p>
              </div>

              {/* //? PERMISSIONS */}
              <div className="border p-4 sm:p-6 rounded-md">
                <h2 className="text-lg mb-6 font-medium">Permissions</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {PermissionData.map((group) => {
                    const groupPermissions = group.Type.filter((perm) =>
                      permissions.includes(perm.type_value),
                    );

                    if (!groupPermissions.length) return null;

                    return (
                      <div
                        key={group.Name}
                        className="rounded-md border bg-background p-4"
                      >
                        <h3 className="text-sm font-semibold mb-4 border-b pb-2">
                          {group.Name}
                        </h3>

                        <div className="flex flex-col gap-3">
                          {groupPermissions.map((perm) => (
                            <div
                              key={perm.type_value}
                              className={cn(
                                "flex items-start justify-between gap-4 rounded-md p-3",
                                "bg-muted/40",
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

                              {/* //? Right (read-only) */}
                              <Switch size="lg" checked disabled />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ViewPermission;
