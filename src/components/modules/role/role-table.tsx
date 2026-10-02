import { useDeleteRole } from "@/api/role/role.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateFormat } from "@/hooks/use-date-format";
import { PanelsTopLeft, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteButton from "../../custom/delete-button";
import TableSkeleton from "../../skeleton/table-skeleton";
import ViewPermission from "./view-permission";

const RoleTable = ({
  roleData = [],
  isLoading,
  handleUpdate,
  refetch,
  can,
  serial,
}: {
  roleData?: any[];
  isLoading: boolean;
  handleUpdate: (id: string) => void;
  refetch: () => void;
  can: (permission: string) => boolean;
  serial: (index: number) => number;
}) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  //! delete role API
  const { mutateAsync: deleteRole } = useDeleteRole();

  useEffect(() => {
    if (roleData?.length) {
      refetch();
    }
  }, [roleData?.length]);

  const handleView = (item: any) => {
    setViewData(item);
    setViewModalOpen(true);
  };

  if (isLoading) return <TableSkeleton />;

  if (!roleData?.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No role found
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Create a new role to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="w-16 text-center font-semibold">
                  #
                </TableHead>
                <TableHead className="font-semibold">Role Name</TableHead>
                <TableHead className="text-center font-semibold">
                  View Permissions
                </TableHead>

                <TableHead className="font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Created
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Updated
                </TableHead>

                {(can("admin_role_update") || can("admin_role_delete")) && (
                  <TableHead className="w-24 text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {roleData?.map((item, index) => (
                <TableRow
                  key={item?._id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {serial(index)}
                  </TableCell>

                  {/* ROLE NAME */}
                  <TableCell className="font-medium capitalize">
                    {item?.admin_role_name}
                  </TableCell>

                  {/*  VIEW PERMISSION */}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Button
                        onClick={() => handleView(item)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <PanelsTopLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-muted-foreground text-center">
                    {item?.admin_role_status === "active" ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">In Active</Badge>
                    )}
                  </TableCell>

                  <TableCell className="font-medium capitalize">
                    {item?.publisher_id?.admin_name ? (
                      <div className="">
                        <p className="text-xs text-muted-foreground">
                          {item?.publisher_id?.admin_phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {" "}
                          {DateFormat(item?.createdAt)}
                        </p>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {item?.updated_id ? (
                      <div>
                        <p>{item?.updated_id?.admin_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item?.updated_id?.admin_phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {DateFormat(item?.updatedAt)}
                        </p>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>

                  {/*  ACTIONS */}
                  {(can("admin_role_update") || can("admin_role_delete")) && (
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {/*  UPDATE */}
                        {can("admin_role_update") && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdate(item)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}

                        {/*  DELETE */}
                        {can("admin_role_delete") && (
                          <DeleteButton
                            title="Delete Role"
                            description="This role will be permanently deleted."
                            onDelete={() => deleteRole(item._id)}
                          />
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/*  VIEW PERMISSION */}

      <ViewPermission
        open={viewModalOpen}
        setOpen={() => setViewModalOpen(false)}
        viewData={viewData}
      />
    </section>
  );
};

export default RoleTable;
