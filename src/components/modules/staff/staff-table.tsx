import type { IRole } from "@/api/role/role.api";
import { useDeleteStaff, type IStaff } from "@/api/staff/staff.api";
import DeleteButton from "@/components/custom/delete-button";
import TableSkeleton from "@/components/skeleton/table-skeleton";
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
import { useState } from "react";
import ViewPermission from "../role/view-permission";

type StaffTableProps = {
  data?: IStaff[];
  isLoading: boolean;
  handleUpdate: (item: IStaff) => void;
  refetch: () => void;
  can: (permission: string) => boolean;
  serial: (index: number) => number;
};

const StaffTable = ({
  data = [],
  isLoading,
  handleUpdate,
  refetch,
  can,
  serial,
}: StaffTableProps) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<IRole | null>(null);

  // !delete staff API
  const { mutateAsync: deleteStaff } = useDeleteStaff();

  const handleView = (item: IStaff["admin_role_id"]) => {
    if (!item || typeof item === "string") return;

    setViewData(item);
    setViewModalOpen(true);
  };

  if (isLoading) return <TableSkeleton />;

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No staff found
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Create a new staff to get started
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
                <TableHead className="font-semibold"> Admin Name</TableHead>
                <TableHead className="font-semibold"> Phone</TableHead>
                <TableHead className="font-semibold"> Role</TableHead>
                <TableHead className="font-semibold"> Status</TableHead>
                <TableHead className="text-center font-semibold">
                  View Permissions
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Created
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Updated
                </TableHead>

                {(can("admin_update") || can("admin_delete")) && (
                  <TableHead className="w-24 text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((item, index) => (
                <TableRow
                  key={item?._id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0 text-center"
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {serial(index)}
                  </TableCell>
                  {/* //? admin name */}
                  <TableCell className="font-medium capitalize">
                    {item?.admin_name}
                  </TableCell>
                  {/* //? admin phone */}
                  <TableCell className="font-medium capitalize">
                    {item?.admin_phone}
                  </TableCell>
                  {/* //? admin role */}
                  <TableCell className="font-medium capitalize">
                    {typeof item?.admin_role_id === "string"
                      ? item.admin_role_id
                      : item?.admin_role_id?.admin_role_name}
                  </TableCell>
                  {/* //? admin status */}
                  <TableCell className="">
                    {item?.admin_status === "active" ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">In Active</Badge>
                    )}
                  </TableCell>
                  {/* //? view permissions */}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Button
                        onClick={() => handleView(item?.admin_role_id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <PanelsTopLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  {/* //? created at */}
                  <TableCell className="whitespace-pre-line text-center text-muted-foreground">
                    <p> {item?.publisher_id?.admin_name}</p>
                    {item?.publisher_id?.admin_name
                      ? DateFormat(item?.createdAt)
                      : "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-pre-line text-center text-muted-foreground">
                    <p> {item?.updated_id?.admin_name}</p>
                    {item?.updated_id?.admin_name
                      ? DateFormat(item?.updatedAt)
                      : "N/A"}
                  </TableCell>

                  {(can("admin_update") || can("admin_delete")) && (
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {/* //? update button */}
                        {can("admin_update") && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleUpdate(item)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {/* //? delete button */}
                        {can("admin_delete") && (
                          <DeleteButton
                            title="Delete Staff"
                            description="This staff member will be permanently deleted."
                            onDelete={async () => {
                              await deleteStaff(item._id);
                              refetch();
                            }}
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

      {/* //? view permission modal */}
      {viewModalOpen && (
        <ViewPermission
          open={viewModalOpen}
          setOpen={() => setViewModalOpen(false)}
          viewData={viewData}
        />
      )}
    </section>
  );
};

export default StaffTable;
