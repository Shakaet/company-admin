import { useCreateTestimonial, useDeleteTestimonial, useGetTestimonials, useUpdateTestimonial } from "@/api/home-elements/home-elements.api";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestimonialsTab() {
  const { data, isLoading } = useGetTestimonials();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteTestimonial();

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50/50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-slate-800">Testimonials</h2>
        {can("home_create") && (
          <CreateButton label="Add Testimonial" onClick={() => setCreateModalOpen(true)} />
        )}
      </div>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold text-center">Rating</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Created At</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <TableSkeleton rows={3} columns={5} />
                </TableCell>
              </TableRow>
            ) : !data?.data?.data || data.data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No testimonials found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.role}, {item.company}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? "fill-current" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={item.status === "active"} disabled />
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{DateFormat(item.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      {can("home_update") && (
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                      {can("home_delete") && (
                        <DeleteButton
                          onClick={() => handleDelete(item._id)}
                          isPending={isDeleting}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TestimonialCreateModal open={createModalOpen} onClose={setCreateModalOpen} />
      <TestimonialUpdateModal open={updateModalOpen} onClose={setUpdateModalOpen} item={selectedItem} />
    </div>
  );
}

const TestimonialCreateModal = ({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) => {
  const { mutateAsync: createItem, isPending } = useCreateTestimonial();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "",
    rating: 5,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem({ ...formData, status: "active" });
      onClose(false);
      setFormData({ name: "", role: "", company: "", avatar: "", rating: 5, message: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Avatar Image URL</Label>
            <Input value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Testimonial Message</Label>
            <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={4} />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !formData.name}>
              {isPending ? "Saving..." : "Save Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TestimonialUpdateModal = ({ open, onClose, item }: { open: boolean; onClose: (open: boolean) => void; item: any }) => {
  const { mutateAsync: updateItem, isPending } = useUpdateTestimonial();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "",
    rating: 5,
    message: "",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        role: item.role,
        company: item.company,
        avatar: item.avatar,
        rating: item.rating,
        message: item.message,
        status: item.status
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?._id) return;
    try {
      await updateItem({ id: item._id, payload: formData });
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Avatar Image URL</Label>
            <Input value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Testimonial Message</Label>
            <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={4} />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={formData.status === "active"}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
            />
            <Label>Active Status</Label>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !formData.name}>
              {isPending ? "Updating..." : "Update Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
