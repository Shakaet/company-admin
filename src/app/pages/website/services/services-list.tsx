import { useGetServicesForAdmin, useDeleteService, useCreateService, useUpdateService } from "@/api/service/service.api";
import type { IService } from "@/api/service/service.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationCustom from "@/components/custom/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/custom/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ServicesListPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetServicesForAdmin({ page, limit: 10, searchterm: searchTerm });
  const { can } = useAdminPermission();
  const { mutate: deleteItem } = useDeleteService();

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteItem(id);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Services Management</h2>
          <p className="text-sm text-slate-500">Manage all your services and offerings</p>
        </div>
        <div className="flex gap-4">
          <Input 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          {can("service_create") && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Service Info</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No services found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.data?.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-3">
                      {item.icon && <img src={item.icon} alt={item.title} className="w-10 h-10 rounded object-cover" />}
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === "active" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {DateFormat(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!can("service_update")}
                        onClick={() => {
                          setSelectedItem(item);
                          setUpdateOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        disabled={!can("service_delete")}
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <PaginationCustom
          currentPage={page}
          onPageChange={(p) => setPage(p)}
          totalPages={Math.ceil((data?.data?.total || 0) / 10)}
        />
      </div>

      {createOpen && <ServiceFormModal open={createOpen} onClose={setCreateOpen} />}
      {updateOpen && <ServiceFormModal open={updateOpen} onClose={setUpdateOpen} item={selectedItem} />}
    </div>
  );
}

// ----------------------------------------------------------------------
// FORM MODAL (CREATE & UPDATE)
// ----------------------------------------------------------------------
const ServiceFormModal = ({ open, onClose, item }: { open: boolean; onClose: (val: boolean) => void, item?: any }) => {
  const { mutateAsync: createItem, isPending: isCreating } = useCreateService();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateService();
  const isPending = isCreating || isUpdating;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState<Partial<IService>>({
    title: "", category: "", shortDesc: "", description: "", badge: "", heroHeadline: "", pricingStartingAt: "", status: "active",
    features: [], deliverables: [], benefits: [], techStack: [], process: [], faqs: []
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title, category: item.category, shortDesc: item.shortDesc, description: item.description,
        badge: item.badge || "", heroHeadline: item.heroHeadline || "", pricingStartingAt: item.pricingStartingAt || "",
        status: item.status, features: item.features || [], deliverables: item.deliverables || [], benefits: item.benefits || [],
        techStack: item.techStack || [], process: item.process || [], faqs: item.faqs || []
      });
      setPreviewUrl(item.icon || "");
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (selectedFile instanceof File) fd.append("icon", selectedFile);
      
      const payload = {
        ...formData,
        slug: formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      };
      
      fd.append("data", JSON.stringify(payload));

      if (item?._id) {
        await updateItem({ id: item._id, payload: fd });
      } else {
        await createItem(fd);
      }
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStringArrayChange = (field: keyof IService, index: number, val: string) => {
    const arr = [...(formData[field] as string[])];
    arr[index] = val;
    setFormData({ ...formData, [field]: arr });
  };
  const addStringArrayItem = (field: keyof IService) => setFormData({ ...formData, [field]: [...(formData[field] as string[]), ""] });
  const removeStringArrayItem = (field: keyof IService, index: number) => setFormData({ ...formData, [field]: (formData[field] as string[]).filter((_, i) => i !== index) });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Update Service" : "Add New Service"}</DialogTitle></DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto bg-transparent p-0 mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap">Basic Info</TabsTrigger>
              <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap">Content & Pricing</TabsTrigger>
              <TabsTrigger value="lists" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap">Features & Process</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <FileUpload label="Service Icon" value={selectedFile} onChange={(f) => setSelectedFile(f as File)} preview={previewUrl} />
                </div>
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  <p className="text-xs text-slate-500">Slug will be auto-generated from title.</p>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    required
                  >
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
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="lists" className="space-y-6 outline-none">
              {/* Simple String Arrays */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Features */}
                <div className="space-y-3 p-3 border rounded-md">
                  <Label className="font-semibold">Features</Label>
                  {formData.features?.map((f, i) => (
                    <div key={i} className="flex gap-2"><Input value={f} onChange={(e) => handleStringArrayChange("features", i, e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => removeStringArrayItem("features", i)}><X className="w-4 h-4"/></Button></div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addStringArrayItem("features")}>+ Add Feature</Button>
                </div>
                {/* Tech Stack */}
                <div className="space-y-3 p-3 border rounded-md">
                  <Label className="font-semibold">Tech Stack</Label>
                  {formData.techStack?.map((t, i) => (
                    <div key={i} className="flex gap-2"><Input value={t} onChange={(e) => handleStringArrayChange("techStack", i, e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => removeStringArrayItem("techStack", i)}><X className="w-4 h-4"/></Button></div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addStringArrayItem("techStack")}>+ Add Tech Stack</Button>
                </div>
              </div>

              {/* Benefits (Title + Desc) */}
              <div className="space-y-3 p-3 border rounded-md">
                <Label className="font-semibold">Benefits</Label>
                {formData.benefits?.map((b, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center relative p-2 border sm:border-0 rounded-md sm:p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 w-full pr-6 sm:pr-0">
                      <Input placeholder="Title" value={b.title} onChange={(e) => { const n = [...(formData.benefits||[])]; n[i].title = e.target.value; setFormData({...formData, benefits: n}); }} />
                      <Input placeholder="Description" value={b.desc} onChange={(e) => { const n = [...(formData.benefits||[])]; n[i].desc = e.target.value; setFormData({...formData, benefits: n}); }} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 sm:static sm:top-auto sm:right-auto" onClick={() => setFormData({...formData, benefits: formData.benefits?.filter((_, x) => x !== i)})}><X className="w-4 h-4 text-red-500"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData({...formData, benefits: [...(formData.benefits||[]), {title: "", desc: ""}]})}>+ Add Benefit</Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Service"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
