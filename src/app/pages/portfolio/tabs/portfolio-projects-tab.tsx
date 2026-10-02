import { useState, useEffect } from "react";
import { useGetProjectsForAdmin, useCreateProject, useUpdateProject, useDeleteProject, useGetAllCategories } from "@/api/portfolio/portfolio.api";
import type { IProject } from "@/api/portfolio/portfolio.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, X } from "lucide-react";
import FileUpload from "@/components/custom/file-upload";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import DeleteButton from "@/components/custom/delete-button";
import SearchInput from "@/components/custom/search-input";
import CreateButton from "@/components/custom/create-button";
import PaginationCustom from "@/components/custom/pagination";

export default function PortfolioProjectsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetProjectsForAdmin({ page, limit: 10, searchterm: search });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteItem } = useDeleteProject();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search projects..." onSearch={setSearch} />
        {can("portfolio_create") && (
          <CreateButton label="Add Project" onClick={() => setCreateOpen(true)} />
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? <TableSkeleton columns={5} rows={5} /> : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No projects found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add a new project to get started</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="font-semibold">Project</TableHead>
                  <TableHead className="font-semibold text-center">Category</TableHead>
                  <TableHead className="font-semibold text-center">Client</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created</TableHead>
                  {(can("portfolio_update") || can("portfolio_delete")) && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover border border-border" />}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          {item.year && <p className="text-xs text-muted-foreground">{item.year}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center"><Badge variant="outline">{item.category?.name || item.category}</Badge></TableCell>
                    <TableCell className="text-center text-sm">{item.client}</TableCell>
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
                            <DeleteButton title="Delete Project" description="This project will be permanently deleted."
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

      <PaginationCustom currentPage={page} onPageChange={setPage} totalPages={Math.ceil(total / 10)} />

      {createOpen && <ProjectFormModal open={createOpen} onClose={setCreateOpen} />}
      {updateOpen && selected && <ProjectFormModal open={updateOpen} onClose={setUpdateOpen} item={selected} />}
    </div>
  );
}

const ProjectFormModal = ({ open, onClose, item }: { open: boolean; onClose: (v: boolean) => void; item?: any }) => {
  const { mutateAsync: create, isPending: isCreating } = useCreateProject();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateProject();
  const { data: categoriesData } = useGetAllCategories();
  const categories = (categoriesData?.data as any) || [];
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState<Partial<IProject>>({ title: "", category: "", client: "", year: "", description: "", liveUrl: "", status: "active", featured: false });

  useEffect(() => {
    if (item) {
      setForm({ title: item.title, category: item.category?._id || item.category, client: item.client, year: item.year || "", description: item.description, liveUrl: item.liveUrl || "", status: item.status, featured: item.featured || false });
      setTags(item.tags || []);
      setPreview(item.image || "");
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    if (file) fd.append("image", file);
    fd.append("data", JSON.stringify({ ...form, tags }));
    try {
      if (item?._id) await update({ id: item._id, payload: fd });
      else await create(fd);
      onClose(false);
    } catch (err) { console.error(err); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Update Project" : "Add Project"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUpload label="Project Image" value={file} onChange={f => setFile(f as File)} preview={preview} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.category as string} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {(Array.isArray(categories) ? categories : []).map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Client</Label><Input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Year</Label><Input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
            <div className="space-y-2"><Label>Live URL</Label><Input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required /></div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } } }} placeholder="Press Enter to add tag" />
              <Button type="button" variant="outline" onClick={() => { if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1 cursor-pointer" onClick={() => setTags(tags.filter((_, j) => j !== i))}>{tag}<X className="w-3 h-3" /></Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
            <Label htmlFor="featured">Featured Project</Label>
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
