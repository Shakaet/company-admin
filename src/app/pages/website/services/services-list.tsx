import { useState, useEffect } from "react";
import { useGetServicesForAdmin, useDeleteService, useCreateService, useUpdateService } from "@/api/service/service.api";
import type { IService } from "@/api/service/service.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/custom/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import DeleteButton from "@/components/custom/delete-button";
import SearchInput from "@/components/custom/search-input";
import CreateButton from "@/components/custom/create-button";
import Header from "@/components/custom/header";
import PaginationCustom from "@/components/custom/pagination";
import { useAdminPermission } from "@/helper/use-admin-permission";

export default function ServicesListPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, refetch } = useGetServicesForAdmin({ page, limit: 10, searchterm: searchTerm });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteItem } = useDeleteService();

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-6">
      <Header title="Services Management" description="Manage all your services and offerings" />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search services..." onSearch={setSearchTerm} />
        {can("service_create") && (
          <CreateButton label="Add Service" onClick={() => setCreateOpen(true)} />
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={4} rows={6} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No services found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Create a new service to get started</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="font-semibold">Service Info</TableHead>
                  <TableHead className="font-semibold text-center">Category</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created</TableHead>
                  {(can("service_update") || can("service_delete")) && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.icon && <img src={item.icon} alt={item.title} className="w-10 h-10 rounded object-cover border border-border" />}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{DateFormat(item.createdAt)}</TableCell>
                    {(can("service_update") || can("service_delete")) && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {can("service_update") && (
                            <Button size="icon" variant="outline" onClick={() => { setSelectedItem(item); setUpdateOpen(true); }}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {can("service_delete") && (
                            <DeleteButton
                              title="Delete Service"
                              description="This service will be permanently deleted."
                              onDelete={async () => { await deleteItem(item._id); refetch(); }}
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

      <PaginationCustom currentPage={page} onPageChange={setPage} totalPages={Math.ceil(total / 10)} />

      {createOpen && <ServiceFormModal open={createOpen} onClose={setCreateOpen} />}
      {updateOpen && <ServiceFormModal open={updateOpen} onClose={setUpdateOpen} item={selectedItem} />}
    </div>
  );
}

// -----------------------------------------------------------------------
const ServiceFormModal = ({ open, onClose, item }: { open: boolean; onClose: (val: boolean) => void; item?: any }) => {
  const { mutateAsync: createItem, isPending: isCreating } = useCreateService();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateService();
  const isPending = isCreating || isUpdating;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<Partial<IService>>({
    title: "", category: "", shortDesc: "", description: "", badge: "", heroHeadline: "", pricingStartingAt: "", status: "active",
    features: [], deliverables: [], benefits: [], techStack: [], process: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title, category: item.category, shortDesc: item.shortDesc, description: item.description,
        badge: item.badge || "", heroHeadline: item.heroHeadline || "", pricingStartingAt: item.pricingStartingAt || "",
        status: item.status, features: item.features || [], deliverables: item.deliverables || [], benefits: item.benefits || [],
        techStack: item.techStack || [], process: item.process || [],
      });
      setPreviewUrl(item.icon || "");
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (selectedFile instanceof File) fd.append("icon", selectedFile);
      const payload = { ...formData, slug: formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') };
      fd.append("data", JSON.stringify(payload));
      if (item?._id) await updateItem({ id: item._id, payload: fd });
      else await createItem(fd);
      onClose(false);
    } catch (err) { console.error(err); }
  };

  const handleStringArrayChange = (field: keyof IService, index: number, val: string) => {
    const arr = [...(formData[field] as string[])]; arr[index] = val;
    setFormData({ ...formData, [field]: arr });
  };
  const addItem = (field: keyof IService) => setFormData({ ...formData, [field]: [...(formData[field] as string[]), ""] });
  const removeItem = (field: keyof IService, i: number) => setFormData({ ...formData, [field]: (formData[field] as string[]).filter((_, j) => j !== i) });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Update Service" : "Add New Service"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto bg-transparent p-0 mb-4 overflow-x-auto flex-nowrap">
              {["basic", "content", "lists"].map(tab => (
                <TabsTrigger key={tab} value={tab} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap capitalize">{tab === "lists" ? "Features & Lists" : tab === "basic" ? "Basic Info" : "Content & Pricing"}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="basic" className="space-y-4 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <FileUpload label="Service Icon" value={selectedFile} onChange={(f) => setSelectedFile(f as File)} preview={previewUrl} />
                </div>
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  <p className="text-xs text-muted-foreground">Slug will be auto-generated from title.</p>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                    <option value="" disabled>Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="SEO & Content">SEO & Content</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Hero Headline (Optional)</Label>
                  <Input value={formData.heroHeadline} onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Badge / Tag (Optional)</Label>
                  <Input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder="e.g. Popular, New" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 outline-none">
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} required rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Pricing Starting At (Optional)</Label>
                <Input value={formData.pricingStartingAt} onChange={(e) => setFormData({ ...formData, pricingStartingAt: e.target.value })} placeholder="e.g. $500" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="lists" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["features", "techStack"] as const).map(field => (
                  <div key={field} className="space-y-3 p-3 border border-border rounded-md bg-card">
                    <Label className="font-semibold capitalize">{field === "techStack" ? "Tech Stack" : "Features"}</Label>
                    {(formData[field] as string[])?.map((v, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={v} onChange={(e) => handleStringArrayChange(field, i, e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(field, i)}><X className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem(field)}>+ Add</Button>
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-3 border border-border rounded-md bg-card">
                <Label className="font-semibold">Benefits</Label>
                {formData.benefits?.map((b, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-2 items-start relative p-2 border border-border sm:border-0 rounded-md sm:p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full pr-8 sm:pr-0">
                      <Input placeholder="Title" value={b.title} onChange={(e) => { const n = [...(formData.benefits || [])]; n[i].title = e.target.value; setFormData({ ...formData, benefits: n }); }} />
                      <Input placeholder="Description" value={b.desc} onChange={(e) => { const n = [...(formData.benefits || [])]; n[i].desc = e.target.value; setFormData({ ...formData, benefits: n }); }} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 sm:static" onClick={() => setFormData({ ...formData, benefits: formData.benefits?.filter((_, j) => j !== i) })}><X className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, benefits: [...(formData.benefits || []), { title: "", desc: "" }] })}>+ Add Benefit</Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Service"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
