import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useGetTestimonials,
  useUpdateTestimonial,
} from "@/api/home-elements/home-elements.api";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const { mutateAsync: deleteItem } = useDeleteTestimonial();

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const items = data?.data?.data || [];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Testimonials</h2>
          <p className="text-sm text-muted-foreground">
            Client reviews and feedback displayed on the website
          </p>
        </div>
        {can("home_create") && (
          <CreateButton
            label="Add Testimonial"
            onClick={() => setCreateModalOpen(true)}
          />
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={5} rows={4} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No testimonials found
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add a client testimonial to get started
                </p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold text-center">Rating</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created At</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-border">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>
                            {item.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.role}, {item.company}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.rating
                                ? "fill-current"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch checked={item.status === "active"} disabled />
                        <Badge
                          variant={
                            item.status === "active" ? "default" : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {DateFormat(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {can("home_update") && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(item)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                        {can("home_delete") && (
                          <DeleteButton
                            title="Delete Testimonial"
                            description="This testimonial will be permanently deleted."
                            onDelete={async () => {
                              await deleteItem(item._id);
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <TestimonialCreateModal
        open={createModalOpen}
        onClose={setCreateModalOpen}
      />
      <TestimonialUpdateModal
        open={updateModalOpen}
        onClose={setUpdateModalOpen}
        item={selectedItem}
      />
    </div>
  );
}

const TestimonialCreateModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
}) => {
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
      setFormData({
        name: "",
        role: "",
        company: "",
        avatar: "",
        rating: 5,
        message: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Avatar Image URL</Label>
            <Input
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Testimonial Message</Label>
            <Textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.name}>
              {isPending ? "Saving..." : "Save Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TestimonialUpdateModal = ({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  item: any;
}) => {
  const { mutateAsync: updateItem, isPending } = useUpdateTestimonial();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "",
    rating: 5,
    message: "",
    status: "active" as "active" | "inactive",
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
        status: item.status,
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
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Avatar Image URL</Label>
            <Input
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Testimonial Message</Label>
            <Textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  status: checked ? "active" : "inactive",
                })
              }
            />
            <Label>Active Status</Label>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.name}>
              {isPending ? "Updating..." : "Update Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
