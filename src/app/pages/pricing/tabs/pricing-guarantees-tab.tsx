import { useState, useEffect } from "react";
import {
  useGetGuaranteesForAdmin,
  useCreateGuarantee,
  useUpdateGuarantee,
  useDeleteGuarantee,
} from "@/api/pricing/pricing.api";
import type { IPricingGuarantee } from "@/api/pricing/pricing.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import DeleteButton from "@/components/custom/delete-button";
import CreateButton from "@/components/custom/create-button";
import PaginationCustom from "@/components/custom/pagination";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2 } from "lucide-react";

export default function PricingGuaranteesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetGuaranteesForAdmin({ page, limit: 10 });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteItem } = useDeleteGuarantee();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Pricing Guarantees</h2>
          <p className="text-sm text-muted-foreground">Manage guarantee features shown on pricing page</p>
        </div>
        {can("pricing_create") && (
          <CreateButton label="Add Guarantee" onClick={() => setCreateOpen(true)} />
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={4} rows={5} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No guarantees found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add a new guarantee to get started</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="font-semibold">Label</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold text-center">Icon</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created</TableHead>
                  {(can("pricing_update") || can("pricing_delete")) && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[240px] truncate">
                      {item.desc}
                    </TableCell>
                    <TableCell className="text-center">
                      <code className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {item.icon}
                      </code>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {DateFormat(item.createdAt)}
                    </TableCell>
                    {(can("pricing_update") || can("pricing_delete")) && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {can("pricing_update") && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                setSelected(item);
                                setUpdateOpen(true);
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {can("pricing_delete") && (
                            <DeleteButton
                              title="Delete Guarantee"
                              description="This guarantee will be permanently deleted."
                              onDelete={async () => {
                                await deleteItem(item._id);
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
          )}
        </div>
      </div>

      <PaginationCustom
        currentPage={page}
        onPageChange={setPage}
        totalPages={Math.ceil(total / 10)}
      />

      {createOpen && (
        <GuaranteeFormModal
          open={createOpen}
          onClose={setCreateOpen}
          refetch={refetch}
        />
      )}
      {updateOpen && selected && (
        <GuaranteeFormModal
          open={updateOpen}
          onClose={setUpdateOpen}
          item={selected}
          refetch={refetch}
        />
      )}
    </div>
  );
}

const GuaranteeFormModal = ({
  open,
  onClose,
  item,
  refetch,
}: {
  open: boolean;
  onClose: (v: boolean) => void;
  item?: any;
  refetch?: () => void;
}) => {
  const { mutateAsync: create, isPending: isCreating } = useCreateGuarantee();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateGuarantee();
  const [form, setForm] = useState<Partial<IPricingGuarantee>>({
    icon: "",
    label: "",
    desc: "",
    status: "active",
  });

  useEffect(() => {
    if (item)
      setForm({
        icon: item.icon,
        label: item.label,
        desc: item.desc,
        status: item.status,
      });
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (item?._id) await update({ id: item._id, payload: form });
      else await create(form);
      refetch?.();
      onClose(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Update Guarantee" : "Add Guarantee"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Icon (lucide name)</Label>
            <Input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. ShieldCheck"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
            >
              <option value="active" className="bg-popover text-popover-foreground">
                Active
              </option>
              <option value="inactive" className="bg-popover text-popover-foreground">
                Inactive
              </option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
