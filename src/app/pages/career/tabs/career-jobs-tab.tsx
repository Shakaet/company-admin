import { useState, useEffect } from "react";
import {
  useGetJobsForAdmin,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
} from "@/api/career/career.api";
import type { ICareerJob } from "@/api/career/career.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import DeleteButton from "@/components/custom/delete-button";
import SearchInput from "@/components/custom/search-input";
import CreateButton from "@/components/custom/create-button";
import PaginationCustom from "@/components/custom/pagination";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, X } from "lucide-react";

export default function CareerJobsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetJobsForAdmin({
    page,
    limit: 10,
    searchterm: search,
  });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteItem } = useDeleteJob();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search jobs..." onSearch={setSearch} />
        {can("career_create") && (
          <CreateButton label="Post Job" onClick={() => setCreateOpen(true)} />
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={4} rows={5} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No jobs found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Post a new job opening to get started
                </p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="font-semibold">Job Info</TableHead>
                  <TableHead className="font-semibold text-center">Type</TableHead>
                  <TableHead className="font-semibold text-center">Deadline</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created</TableHead>
                  {(can("career_update") || can("career_delete")) && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <TableCell>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.department} • {item.location}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {item.featured && (
                          <Badge variant="outline" className="text-xs">
                            Featured
                          </Badge>
                        )}
                        {item.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.type}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.workplaceType}
                      </p>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.deadline}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.status === "active" ? "default" : "secondary"}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {DateFormat(item.createdAt)}
                    </TableCell>
                    {(can("career_update") || can("career_delete")) && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {can("career_update") && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                setSelected(item);
                                setUpdateOpen(true);
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {can("career_delete") && (
                            <DeleteButton
                              title="Delete Job"
                              description="This job opening will be permanently deleted."
                              onDelete={async () => {
                                await deleteItem(item._id);
                                refetch();
                              }}
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

      <PaginationCustom
        currentPage={page}
        onPageChange={setPage}
        totalPages={Math.ceil(total / 10)}
      />

      {createOpen && (
        <JobFormModal
          open={createOpen}
          onClose={setCreateOpen}
          refetch={refetch}
        />
      )}
      {updateOpen && selected && (
        <JobFormModal
          open={updateOpen}
          onClose={setUpdateOpen}
          item={selected}
          refetch={refetch}
        />
      )}
    </div>
  );
}

const StringArrayField = ({
  label,
  items,
  onAdd,
  onRemove,
  onChange,
}: {
  label: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  onChange: (i: number, v: string) => void;
}) => {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-2 p-3 border border-border rounded-md bg-muted/20">
      <Label className="font-semibold">{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item} onChange={(e) => onChange(i, e.target.value)} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(i)}
          >
            <X className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}...`}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (e.preventDefault(),
            input.trim() && (onAdd(input.trim()), setInput("")))
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (input.trim()) {
              onAdd(input.trim());
              setInput("");
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

const JobFormModal = ({
  open,
  onClose,
  item,
  refetch,
}: {
  open: boolean;
  onClose: (v: boolean) => void;
  item?: any;
  refetch?: () => void;
}) => {
  const { mutateAsync: create, isPending: isCreating } = useCreateJob();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateJob();
  const [form, setForm] = useState<Partial<ICareerJob>>({
    title: "",
    department: "",
    type: "Full-time",
    workplaceType: "Remote",
    location: "",
    experience: "",
    salary: "",
    deadline: "",
    postedDate: new Date().toISOString().split("T")[0],
    featured: false,
    urgent: false,
    description: "",
    aboutRole: "",
    status: "active",
  });
  const [lists, setLists] = useState({
    responsibilities: [] as string[],
    requirements: [] as string[],
    niceToHave: [] as string[],
    benefits: [] as string[],
    techStack: [] as string[],
  });

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        department: item.department,
        type: item.type,
        workplaceType: item.workplaceType,
        location: item.location,
        experience: item.experience,
        salary: item.salary,
        deadline: item.deadline,
        postedDate: item.postedDate,
        featured: item.featured || false,
        urgent: item.urgent || false,
        description: item.description,
        aboutRole: item.aboutRole || "",
        status: item.status,
      });
      setLists({
        responsibilities: item.responsibilities || [],
        requirements: item.requirements || [],
        niceToHave: item.niceToHave || [],
        benefits: item.benefits || [],
        techStack: item.techStack || [],
      });
    }
  }, [item]);

  const addToList = (field: keyof typeof lists, val: string) =>
    setLists({ ...lists, [field]: [...lists[field], val] });
  const removeFromList = (field: keyof typeof lists, i: number) =>
    setLists({ ...lists, [field]: lists[field].filter((_, j) => j !== i) });
  const changeInList = (field: keyof typeof lists, i: number, val: string) => {
    const arr = [...lists[field]];
    arr[i] = val;
    setLists({ ...lists, [field]: arr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, ...lists };
      if (item?._id) await update({ id: item._id, payload });
      else await create(payload);
      refetch?.();
      onClose(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Update Job Post" : "Post New Job"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Full-time" className="bg-popover text-popover-foreground">
                  Full-time
                </option>
                <option value="Part-time" className="bg-popover text-popover-foreground">
                  Part-time
                </option>
                <option value="Contract" className="bg-popover text-popover-foreground">
                  Contract
                </option>
                <option value="Freelance" className="bg-popover text-popover-foreground">
                  Freelance
                </option>
                <option value="Internship" className="bg-popover text-popover-foreground">
                  Internship
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Workplace Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.workplaceType}
                onChange={(e) =>
                  setForm({ ...form, workplaceType: e.target.value })
                }
              >
                <option value="Remote" className="bg-popover text-popover-foreground">
                  Remote
                </option>
                <option value="On-site" className="bg-popover text-popover-foreground">
                  On-site
                </option>
                <option value="Hybrid" className="bg-popover text-popover-foreground">
                  Hybrid
                </option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Experience Required</Label>
              <Input
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                placeholder="e.g. 2-3 years"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Salary Range</Label>
              <Input
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. $2000-$3000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Posted Date</Label>
              <Input
                type="date"
                value={form.postedDate}
                onChange={(e) =>
                  setForm({ ...form, postedDate: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as any })
                }
              >
                <option value="active" className="bg-popover text-popover-foreground">
                  Active
                </option>
                <option value="inactive" className="bg-popover text-popover-foreground">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                className="rounded border-input bg-background"
                checked={!!form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="urgent"
                className="rounded border-input bg-background"
                checked={!!form.urgent}
                onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
              />
              <Label htmlFor="urgent" className="cursor-pointer">
                Urgent
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>About The Role (Optional)</Label>
            <Textarea
              value={form.aboutRole}
              onChange={(e) => setForm({ ...form, aboutRole: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringArrayField
              label="Responsibilities"
              items={lists.responsibilities}
              onAdd={(v) => addToList("responsibilities", v)}
              onRemove={(i) => removeFromList("responsibilities", i)}
              onChange={(i, v) => changeInList("responsibilities", i, v)}
            />
            <StringArrayField
              label="Requirements"
              items={lists.requirements}
              onAdd={(v) => addToList("requirements", v)}
              onRemove={(i) => removeFromList("requirements", i)}
              onChange={(i, v) => changeInList("requirements", i, v)}
            />
            <StringArrayField
              label="Nice To Have"
              items={lists.niceToHave}
              onAdd={(v) => addToList("niceToHave", v)}
              onRemove={(i) => removeFromList("niceToHave", i)}
              onChange={(i, v) => changeInList("niceToHave", i, v)}
            />
            <StringArrayField
              label="Benefits"
              items={lists.benefits}
              onAdd={(v) => addToList("benefits", v)}
              onRemove={(i) => removeFromList("benefits", i)}
              onChange={(i, v) => changeInList("benefits", i, v)}
            />
            <div className="md:col-span-2">
              <StringArrayField
                label="Tech Stack"
                items={lists.techStack}
                onAdd={(v) => addToList("techStack", v)}
                onRemove={(i) => removeFromList("techStack", i)}
                onChange={(i, v) => changeInList("techStack", i, v)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
