import { useCreateTechStack, useDeleteTechStack, useGetTechStacks, useUpdateTechStack } from "@/api/home-elements/home-elements.api";
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
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function TechStackTab() {
  const { data, isLoading } = useGetTechStacks();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteTechStack();

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
        <h2 className="text-lg font-semibold text-slate-800">Tech Stack</h2>
        {can("home_create") && (
          <CreateButton label="Add Technology" onClick={() => setCreateModalOpen(true)} />
        )}
      </div>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-center">Name</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Created At</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <TableSkeleton rows={3} columns={4} />
                </TableCell>
              </TableRow>
            ) : !data?.data?.data || data.data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No technologies found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.data.data.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center font-medium">{item.name}</TableCell>
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

      <TechStackCreateModal open={createModalOpen} onClose={setCreateModalOpen} />
      <TechStackUpdateModal open={updateModalOpen} onClose={setUpdateModalOpen} item={selectedItem} />
    </div>
  );
}

const TechStackCreateModal = ({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) => {
  const { mutateAsync: createItem, isPending } = useCreateTechStack();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Technology</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Technology Name (e.g. React.js)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name}>
              {isPending ? "Saving..." : "Save Technology"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TechStackUpdateModal = ({ open, onClose, item }: { open: boolean; onClose: (open: boolean) => void; item: any }) => {
  const { mutateAsync: updateItem, isPending } = useUpdateTechStack();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Technology</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Technology Name (e.g. React.js)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={status === "active"}
              onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")}
            />
            <Label>Active Status</Label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name}>
              {isPending ? "Updating..." : "Update Technology"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
