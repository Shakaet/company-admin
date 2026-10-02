import { useCreateWhyChooseUs, useDeleteWhyChooseUs, useGetWhyChooseUs, useUpdateWhyChooseUs } from "@/api/home-elements/home-elements.api";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import TableSkeleton from "@/components/skeleton/table-skeleton";
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
import { Edit2, Plus, Trash2, Shield, Zap, Star, Heart, CheckCircle, ThumbsUp, Globe, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ICON_OPTIONS = [
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Zap", label: "Lightning (Zap)", icon: Zap },
  { value: "Star", label: "Star", icon: Star },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "CheckCircle", label: "Check Circle", icon: CheckCircle },
  { value: "ThumbsUp", label: "Thumbs Up", icon: ThumbsUp },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Award", label: "Award", icon: Award },
];

export default function WhyChooseUsTab() {
  const { data, isLoading } = useGetWhyChooseUs();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteWhyChooseUs();

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
        <h2 className="text-lg font-semibold text-slate-800">Why Choose Us</h2>
        {can("home_create") && (
          <CreateButton label="Add Feature" onClick={() => setCreateModalOpen(true)} />
        )}
      </div>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-center">Title</TableHead>
              <TableHead className="font-semibold text-center">Badge</TableHead>
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
                  No features found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center font-medium">{item.title}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{item.badge}</Badge>
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

      <WhyChooseUsCreateModal open={createModalOpen} onClose={setCreateModalOpen} />
      <WhyChooseUsUpdateModal open={updateModalOpen} onClose={setUpdateModalOpen} item={selectedItem} />
    </div>
  );
}

const WhyChooseUsCreateModal = ({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) => {
  const { mutateAsync: createItem, isPending } = useCreateWhyChooseUs();
  const [formData, setFormData] = useState({
    title: "",
    badge: "",
    desc: "",
    icon: "Shield", // Default icon or input
    perks: [""],
  });

  const handlePerkChange = (index: number, value: string) => {
    const newPerks = [...formData.perks];
    newPerks[index] = value;
    setFormData({ ...formData, perks: newPerks });
  };

  const addPerk = () => setFormData({ ...formData, perks: [...formData.perks, ""] });
  const removePerk = (index: number) => setFormData({ ...formData, perks: formData.perks.filter((_, i) => i !== index) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem({ ...formData, status: "active", perks: formData.perks.filter(p => p.trim() !== "") });
      onClose(false);
      setFormData({ title: "", badge: "", desc: "", icon: "Shield", perks: [""] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Feature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Badge text (e.g. Proven)</Label>
              <Input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={formData.icon} onValueChange={(val) => setFormData({ ...formData, icon: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4 text-slate-500" />
                        <span>{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} required rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Perks / Points</Label>
            {formData.perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={perk} onChange={(e) => handlePerkChange(index, e.target.value)} placeholder={`Point ${index + 1}`} />
                {formData.perks.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePerk(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPerk} className="mt-2">
              <Plus className="w-4 h-4 mr-2" /> Add Point
            </Button>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !formData.title}>
              {isPending ? "Saving..." : "Save Feature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WhyChooseUsUpdateModal = ({ open, onClose, item }: { open: boolean; onClose: (open: boolean) => void; item: any }) => {
  const { mutateAsync: updateItem, isPending } = useUpdateWhyChooseUs();
  const [formData, setFormData] = useState({
    title: "",
    badge: "",
    desc: "",
    icon: "Shield",
    perks: [""],
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        badge: item.badge,
        desc: item.desc,
        icon: item.icon,
        perks: item.perks?.length ? item.perks : [""],
        status: item.status
      });
    }
  }, [item]);

  const handlePerkChange = (index: number, value: string) => {
    const newPerks = [...formData.perks];
    newPerks[index] = value;
    setFormData({ ...formData, perks: newPerks });
  };

  const addPerk = () => setFormData({ ...formData, perks: [...formData.perks, ""] });
  const removePerk = (index: number) => setFormData({ ...formData, perks: formData.perks.filter((_, i) => i !== index) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?._id) return;
    try {
      await updateItem({ id: item._id, payload: { ...formData, perks: formData.perks.filter(p => p.trim() !== "") } });
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Feature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Badge text</Label>
              <Input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={formData.icon} onValueChange={(val) => setFormData({ ...formData, icon: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4 text-slate-500" />
                        <span>{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} required rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Perks / Points</Label>
            {formData.perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={perk} onChange={(e) => handlePerkChange(index, e.target.value)} placeholder={`Point ${index + 1}`} />
                {formData.perks.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePerk(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPerk} className="mt-2">
              <Plus className="w-4 h-4 mr-2" /> Add Point
            </Button>
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
            <Button type="submit" disabled={isPending || !formData.title}>
              {isPending ? "Updating..." : "Update Feature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
