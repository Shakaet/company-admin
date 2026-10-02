import { useState, useEffect } from "react";
import { useGetHighlightsForAdmin, useCreateHighlight, useUpdateHighlight, useDeleteHighlight } from "@/api/portfolio/portfolio.api";
import type { IPortfolioHighlight } from "@/api/portfolio/portfolio.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2 } from "lucide-react";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import DeleteButton from "@/components/custom/delete-button";
import CreateButton from "@/components/custom/create-button";
import Pagination from "@/components/custom/pagination";
import useSerial from "@/helper/use-serial";

export default function PortfolioHighlightsTab() {
  const [page, setPage] = useState(1);
  const serial = useSerial(page, 10);
  const { data, isLoading, refetch } = useGetHighlightsForAdmin({ page, limit: 10 });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteItem } = useDeleteHighlight();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end">
        {can("portfolio_create") && <CreateButton label="Add Highlight" onClick={() => setCreateOpen(true)} />}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? <TableSkeleton columns={3} rows={5} /> : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No highlights found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add a new highlight to get started</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold text-center">Value</TableHead>
                  <TableHead className="font-semibold text-center">Label</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created</TableHead>
                  {(can("portfolio_update") || can("portfolio_delete")) && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <TableRow key={item._id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                    <TableCell className="text-center font-medium text-muted-foreground">{serial(index)}</TableCell>
                    <TableCell className="text-center font-semibold">{item.value}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{item.label}</TableCell>
                    <TableCell className="text-center"><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                    <TableCell className="text-center text-muted-foreground">{DateFormat(item.createdAt)}</TableCell>
                    {(can("portfolio_update") || can("portfolio_delete")) && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {can("portfolio_update") && (
                            <Button size="icon" variant="outline" onClick={() => { setSelected(item); setUpdateOpen(true); }}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {can("portfolio_delete") && (
                            <DeleteButton title="Delete Highlight" description="This highlight will be permanently deleted."
                              onDelete={async () => { await deleteItem(item._id); refetch(); }} />
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

      <Pagination page={page} setPage={setPage} limit={10} setLimit={() => {}} total={total} />

      {createOpen && <HighlightFormModal open={createOpen} onClose={setCreateOpen} />}
      {updateOpen && selected && <HighlightFormModal open={updateOpen} onClose={setUpdateOpen} item={selected} />}
    </div>
  );
}

const HighlightFormModal = ({ open, onClose, item }: { open: boolean; onClose: (v: boolean) => void; item?: any }) => {
  const { mutateAsync: create, isPending: isCreating } = useCreateHighlight();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateHighlight();
  const [form, setForm] = useState<Partial<IPortfolioHighlight>>({ value: "", label: "", status: "active" });

  useEffect(() => {
    if (item) setForm({ value: item.value, label: item.label, status: item.status });
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (item?._id) await update({ id: item._id, payload: form });
      else await create(form);
      onClose(false);
    } catch (err) { console.error(err); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Update Highlight" : "Add Highlight"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Value</Label><Input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="e.g. 200+" required /></div>
            <div className="space-y-2"><Label>Label</Label><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Projects Done" required /></div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating}>{isCreating || isUpdating ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
