import {
  useCreateWhyChooseUs,
  useDeleteWhyChooseUs,
  useGetWhyChooseUs,
  useUpdateWhyChooseUs,
} from "@/api/home-elements/home-elements.api";
import CreateButton from "@/components/custom/create-button";
import DeleteButton from "@/components/custom/delete-button";
import TableSkeleton from "@/components/skeleton/table-skeleton";
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
import {
  Edit2,
  Plus,
  Trash2,
  Shield,
  Zap,
  Star,
  Heart,
  CheckCircle,
  ThumbsUp,
  Globe,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const { mutateAsync: deleteItem } = useDeleteWhyChooseUs();

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const items = data?.data?.data || [];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Why Choose Us</h2>
          <p className="text-sm text-muted-foreground">
            Highlights and value propositions displayed on homepage
          </p>
        </div>
        {can("home_create") && (
          <CreateButton
            label="Add Feature"
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
                  No features found
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Create a new feature to get started
                </p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold text-center">Badge</TableHead>
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
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.badge}</Badge>
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
                            title="Delete Feature"
                            description="This feature will be permanently deleted."
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

      <WhyChooseUsCreateModal
        open={createModalOpen}
        onClose={setCreateModalOpen}
      />
      <WhyChooseUsUpdateModal
        open={updateModalOpen}
        onClose={setUpdateModalOpen}
        item={selectedItem}
      />
    </div>
  );
}

const WhyChooseUsCreateModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
}) => {
  const { mutateAsync: createItem, isPending } = useCreateWhyChooseUs();
  const [formData, setFormData] = useState({
    title: "",
    badge: "",
    desc: "",
    icon: "Shield",
    perks: [""],
  });

  const handlePerkChange = (index: number, value: string) => {
    const newPerks = [...formData.perks];
    newPerks[index] = value;
    setFormData({ ...formData, perks: newPerks });
  };

  const addPerk = () =>
    setFormData({ ...formData, perks: [...formData.perks, ""] });
  const removePerk = (index: number) =>
    setFormData({
      ...formData,
      perks: formData.perks.filter((_, i) => i !== index),
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem({
        ...formData,
        status: "active",
        perks: formData.perks.filter((p) => p.trim() !== ""),
      });
      onClose(false);
      setFormData({
        title: "",
        badge: "",
        desc: "",
        icon: "Shield",
        perks: [""],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Feature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Badge text (e.g. Proven)</Label>
              <Input
                value={formData.badge}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(val) =>
                  setFormData({ ...formData, icon: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4 text-muted-foreground" />
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
            <Textarea
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Perks / Points</Label>
            {formData.perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={perk}
                  onChange={(e) => handlePerkChange(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                />
                {formData.perks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePerk(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPerk}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Point
            </Button>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.title}>
              {isPending ? "Saving..." : "Save Feature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WhyChooseUsUpdateModal = ({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  item: any;
}) => {
  const { mutateAsync: updateItem, isPending } = useUpdateWhyChooseUs();
  const [formData, setFormData] = useState({
    title: "",
    badge: "",
    desc: "",
    icon: "Shield",
    perks: [""],
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        badge: item.badge,
        desc: item.desc,
        icon: item.icon,
        perks: item.perks?.length ? item.perks : [""],
        status: item.status,
      });
    }
  }, [item]);

  const handlePerkChange = (index: number, value: string) => {
    const newPerks = [...formData.perks];
    newPerks[index] = value;
    setFormData({ ...formData, perks: newPerks });
  };

  const addPerk = () =>
    setFormData({ ...formData, perks: [...formData.perks, ""] });
  const removePerk = (index: number) =>
    setFormData({
      ...formData,
      perks: formData.perks.filter((_, i) => i !== index),
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?._id) return;
    try {
      await updateItem({
        id: item._id,
        payload: {
          ...formData,
          perks: formData.perks.filter((p) => p.trim() !== ""),
        },
      });
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Feature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Badge text</Label>
              <Input
                value={formData.badge}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(val) =>
                  setFormData({ ...formData, icon: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4 text-muted-foreground" />
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
            <Textarea
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Perks / Points</Label>
            {formData.perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={perk}
                  onChange={(e) => handlePerkChange(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                />
                {formData.perks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePerk(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPerk}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Point
            </Button>
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
            <Button type="submit" disabled={isPending || !formData.title}>
              {isPending ? "Updating..." : "Update Feature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
