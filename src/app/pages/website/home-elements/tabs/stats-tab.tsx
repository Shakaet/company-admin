import {
  useCreateStat,
  useDeleteStat,
  useGetStats,
  useUpdateStat,
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

export default function StatsTab() {
  const { data, isLoading } = useGetStats();
  const { can } = useAdminPermission();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<any>(null);

  const { mutateAsync: deleteStat } = useDeleteStat();

  const handleEdit = (stat: any) => {
    setSelectedStat(stat);
    setUpdateModalOpen(true);
  };

  const items = data?.data?.data || [];

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Company Stats</h2>
          <p className="text-sm text-muted-foreground">
            Key metrics and numbers displayed across the website
          </p>
        </div>
        {can("home_create") && (
          <CreateButton
            label="Add Stat"
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
                  No stats found
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Create a new stat to get started
                </p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="font-semibold">Label</TableHead>
                  <TableHead className="font-semibold text-center">Value</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created At</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((stat: any) => (
                  <TableRow
                    key={stat._id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <TableCell className="font-medium">{stat.label}</TableCell>
                    <TableCell className="text-center text-primary font-bold">
                      {stat.value}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch checked={stat.status === "active"} disabled />
                        <Badge
                          variant={
                            stat.status === "active" ? "default" : "secondary"
                          }
                        >
                          {stat.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {DateFormat(stat.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {can("home_update") && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(stat)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                        {can("home_delete") && (
                          <DeleteButton
                            title="Delete Stat"
                            description="This stat will be permanently deleted."
                            onDelete={async () => {
                              await deleteStat(stat._id);
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

      <StatCreateModal open={createModalOpen} onClose={setCreateModalOpen} />
      <StatUpdateModal
        open={updateModalOpen}
        onClose={setUpdateModalOpen}
        stat={selectedStat}
      />
    </div>
  );
}

const StatCreateModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
}) => {
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
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Stat Value (e.g. 250+)</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
            <Button type="submit" disabled={isPending || !label || !value}>
              {isPending ? "Saving..." : "Save Stat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const StatUpdateModal = ({
  open,
  onClose,
  stat,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  stat: any;
}) => {
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
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Stat Value (e.g. 250+)</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
            <Button type="submit" disabled={isPending || !label || !value}>
              {isPending ? "Updating..." : "Update Stat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
