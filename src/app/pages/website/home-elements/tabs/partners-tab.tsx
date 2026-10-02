import {
  useCreatePartner,
  useDeletePartner,
  useGetPartners,
  useUpdatePartner,
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
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function PartnersTab() {
  const { data, isLoading } = useGetPartners();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { mutateAsync: deleteItem } = useDeletePartner();

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const items = data?.data?.data || [];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Partners</h2>
          <p className="text-sm text-muted-foreground">
            Companies, organizations, and clients we partner with
          </p>
        </div>
        {can("home_create") && (
          <CreateButton
            label="Add Partner"
            onClick={() => setCreateModalOpen(true)}
          />
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={4} rows={4} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No partners found
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add a new partner to get started
                </p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Partner Name</TableHead>
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
                    <TableCell className="font-medium">{item.name}</TableCell>
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
                            title="Delete Partner"
                            description="This partner will be permanently deleted."
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

      <PartnerCreateModal
        open={createModalOpen}
        onClose={setCreateModalOpen}
      />
      <PartnerUpdateModal
        open={updateModalOpen}
        onClose={setUpdateModalOpen}
        item={selectedItem}
      />
    </div>
  );
}

const PartnerCreateModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
}) => {
  const { mutateAsync: createItem, isPending } = useCreatePartner();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await createItem({ name, status: "active" });
      onClose(false);
      setName("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Partner Name (e.g. Google)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            <Button type="submit" disabled={isPending || !name}>
              {isPending ? "Saving..." : "Save Partner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PartnerUpdateModal = ({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  item: any;
}) => {
  const { mutateAsync: updateItem, isPending } = useUpdatePartner();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setStatus(item.status);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !item?._id) return;
    try {
      await updateItem({ id: item._id, payload: { name, status } });
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Partner Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={status === "active"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "active" : "inactive")
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
            <Button type="submit" disabled={isPending || !name}>
              {isPending ? "Updating..." : "Update Partner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
