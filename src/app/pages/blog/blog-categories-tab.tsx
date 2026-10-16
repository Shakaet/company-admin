import { useEffect, useState } from "react";
import {
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useGetBlogCategoriesForAdmin,
  useUpdateBlogCategory,
} from "@/api/blog/blog.api";
import type { IBlogCategory } from "@/api/blog/blog.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import Pagination from "@/components/custom/pagination";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import useSerial from "@/helper/use-serial";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BlogCategoriesTab() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<IBlogCategory>();
  const { data, isLoading } = useGetBlogCategoriesForAdmin({ page, limit: 10 });
  const { mutateAsync: remove } = useDeleteBlogCategory();
  const { can } = useAdminPermission();
  const items = data?.data || [];
  const serial = useSerial(page, 10);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end">
        {can("blog_create") && <CreateButton label="Add Category" onClick={() => setCreateOpen(true)} />}
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
        {isLoading ? <TableSkeleton columns={5} rows={5} /> : !items.length ? (
          <div className="py-16 text-center text-muted-foreground">No blog categories found</div>
        ) : (
          <Table>
            <TableHeader><TableRow className="bg-muted/50">
              <TableHead className="w-16 text-center">#</TableHead><TableHead>Name</TableHead>
              <TableHead>Slug</TableHead><TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Created</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>{items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="text-center">{serial(index)}</TableCell><TableCell className="font-medium">{item.name}</TableCell>
                <TableCell><code>{item.slug}</code></TableCell>
                <TableCell className="text-center"><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                <TableCell className="text-center text-muted-foreground">{DateFormat(item.createdAt || "")}</TableCell>
                <TableCell><div className="flex justify-end gap-2">
                  {can("blog_update") && <Button size="icon" variant="outline" onClick={() => setSelected(item)}><Edit2 className="h-4 w-4" /></Button>}
                  {can("blog_delete") && <DeleteButton title="Delete Category" description="This category will be permanently deleted." onDelete={async () => { if (item._id) await remove(item._id); }} />}
                </div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </div>
      <Pagination page={page} setPage={setPage} limit={10} setLimit={() => {}} total={data?.totalData || 0} />
      {(createOpen || selected) && <CategoryModal open={createOpen || !!selected} onClose={(open) => { if (!open) { setCreateOpen(false); setSelected(undefined); } }} item={selected} />}
    </div>
  );
}

function CategoryModal({ open, onClose, item }: { open: boolean; onClose: (open: boolean) => void; item?: IBlogCategory }) {
  const { mutateAsync: create, isPending: creating } = useCreateBlogCategory();
  const { mutateAsync: update, isPending: updating } = useUpdateBlogCategory();
  const [form, setForm] = useState({ name: "", status: "active" as IBlogCategory["status"] });
  useEffect(() => { setForm(item ? { name: item.name, status: item.status } : { name: "", status: "active" }); }, [item]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { name: form.name, slug: form.name.toLowerCase().trim().replace(/\s+/g, "-"), ...(item ? { status: form.status } : {}) };
    if (item?._id) await update({ id: item._id, payload }); else await create(payload);
    onClose(false);
  };
  return <Dialog open={open} onOpenChange={onClose}><DialogContent className="max-w-xl">
    <DialogHeader><DialogTitle>{item ? "Update Blog Category" : "Add Blog Category"}</DialogTitle></DialogHeader>
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
      <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as IBlogCategory["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
      <div className="flex justify-end gap-2 border-t border-border pt-4"><Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button><Button disabled={creating || updating}>{creating || updating ? "Saving..." : "Save"}</Button></div>
    </form>
  </DialogContent></Dialog>;
}
