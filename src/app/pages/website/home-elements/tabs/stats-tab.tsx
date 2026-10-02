import { useCreateStat, useDeleteStat, useGetStats, useUpdateStat } from "@/api/home-elements/home-elements.api";
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

export default function StatsTab() {
  const { data, isLoading } = useGetStats();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<any>(null);

  const { mutateAsync: deleteStat, isPending: isDeleting } = useDeleteStat();

  const handleEdit = (stat: any) => {
    setSelectedStat(stat);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStat(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50/50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-slate-800">Company Stats</h2>
        {can("home_create") && (
          <CreateButton label="Add Stat" onClick={() => setCreateModalOpen(true)} />
        )}
      </div>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-center">Label</TableHead>
              <TableHead className="font-semibold text-center">Value</TableHead>
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
                  No stats found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              data.data.data.map((stat: any) => (
                <TableRow key={stat._id}>
                  <TableCell className="text-center font-medium">{stat.label}</TableCell>
                  <TableCell className="text-center text-primary font-bold">{stat.value}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={stat.status === "active"} disabled />
                      <Badge variant={stat.status === "active" ? "default" : "secondary"}>
                        {stat.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{DateFormat(stat.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      {can("home_update") && (
                        <Button variant="outline" size="icon" onClick={() => handleEdit(stat)}>
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                      {can("home_delete") && (
                        <DeleteButton
                          onClick={() => handleDelete(stat._id)}
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

      <StatCreateModal open={createModalOpen} onClose={setCreateModalOpen} />
      <StatUpdateModal open={updateModalOpen} onClose={setUpdateModalOpen} stat={selectedStat} />
    </div>
  );
}

const StatCreateModal = ({ open, onClose }: { open: boolean; onClose: (open: boolean) => void }) => {
  const { mutateAsync: createStat, isPending } = useCreateStat();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !value) return;
    try {
      await createStat({ label, value, status: "active" });
      onClose(false);
      setLabel("");
      setValue("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Stat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Stat Label (e.g. Projects Delivered)</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Stat Value (e.g. 250+)</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !label || !value}>
              {isPending ? "Saving..." : "Save Stat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const StatUpdateModal = ({ open, onClose, stat }: { open: boolean; onClose: (open: boolean) => void; stat: any }) => {
  const { mutateAsync: updateStat, isPending } = useUpdateStat();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    if (stat) {
      setLabel(stat.label);
      setValue(stat.value);
      setStatus(stat.status);
    }
  }, [stat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !value || !stat?._id) return;
    try {
      await updateStat({ id: stat._id, payload: { label, value, status } });
      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Stat Label (e.g. Projects Delivered)</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Stat Value (e.g. 250+)</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} required />
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
            <Button type="submit" disabled={isPending || !label || !value}>
              {isPending ? "Updating..." : "Update Stat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
