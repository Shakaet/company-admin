import { useState, useEffect } from "react";
import { useGetPlansForAdmin, useCreatePlan, useUpdatePlan, useDeletePlan } from "@/api/pricing/pricing.api";
import type { IPricingPlan } from "@/api/pricing/pricing.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { Edit2, X } from "lucide-react";
import useSerial from "@/helper/use-serial";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import DeleteButton from "@/components/custom/delete-button";
import SearchInput from "@/components/custom/search-input";
import CreateButton from "@/components/custom/create-button";
import Pagination from "@/components/custom/pagination";

export default function PricingPlansTab() {
  const [page, setPage] = useState(1);
  const serial = useSerial(page, 10);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetPlansForAdmin({ page, limit: 10, searchTerm: search });
  const { can } = useAdminPermission();
  const { mutateAsync: deleteItem } = useDeletePlan();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search plans..." onSearch={setSearch} />
        {can("pricing_create") && <CreateButton label="Add Plan" onClick={() => setCreateOpen(true)} />}
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? <TableSkeleton columns={4} rows={5} /> : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No plans found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add a new pricing plan to get started</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Plan Info</TableHead>
                  <TableHead className="font-semibold text-center">Price (Monthly)</TableHead>
                  <TableHead className="font-semibold text-center">Popular</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Created</TableHead>
                  {(can("pricing_update") || can("pricing_delete")) && (
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <TableRow key={item._id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                    <TableCell className="text-center font-medium text-muted-foreground">{serial(index)}</TableCell>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.tagline}</p>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{item.priceMonthly}</TableCell>
                    <TableCell className="text-center">
                      {item.popular ? <Badge>Popular</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell className="text-center"><Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                    <TableCell className="text-center text-muted-foreground">{DateFormat(item.createdAt)}</TableCell>
                    {(can("pricing_update") || can("pricing_delete")) && (
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {can("pricing_update") && (
                            <Button size="icon" variant="outline" onClick={() => { setSelected(item); setUpdateOpen(true); }}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {can("pricing_delete") && (
                            <DeleteButton title="Delete Plan" description="This pricing plan will be permanently deleted."
                              onDelete={async () => { await deleteItem(item._id); refetch(); }} />
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

      <Pagination page={page} setPage={setPage} limit={10} setLimit={() => {}} total={total} />

      {createOpen && <PlanFormModal open={createOpen} onClose={setCreateOpen} />}
      {updateOpen && selected && <PlanFormModal open={updateOpen} onClose={setUpdateOpen} item={selected} />}
    </div>
  );
}

const PlanFormModal = ({ open, onClose, item }: { open: boolean; onClose: (v: boolean) => void; item?: any }) => {
  const { mutateAsync: create, isPending: isCreating } = useCreatePlan();
  const { mutateAsync: update, isPending: isUpdating } = useUpdatePlan();
  const [features, setFeatures] = useState<string[]>([]);
  const [notIncluded, setNotIncluded] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [notIncludedInput, setNotIncludedInput] = useState("");
  const [form, setForm] = useState<Partial<IPricingPlan>>({
    name: "", badge: "", popular: false, priceMonthly: "", priceQuarterly: "", period: "month",
    tagline: "", description: "", idealFor: "", ctaText: "Get Started", ctaHref: "/contact", status: "active"
  });

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, badge: item.badge || "", popular: item.popular || false, priceMonthly: item.priceMonthly, priceQuarterly: item.priceQuarterly || "", period: item.period, tagline: item.tagline, description: item.description, idealFor: item.idealFor, ctaText: item.ctaText, ctaHref: item.ctaHref, status: item.status });
      setFeatures(item.features || []);
      setNotIncluded(item.notIncluded || []);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, features: features.filter(f => f.trim()), notIncluded: notIncluded.filter(n => n.trim()) };
      if (item?._id) await update({ id: item._id, payload });
      else await create(payload);
      onClose(false);
    } catch (err) { console.error(err); }
  };

  const addToList = (list: string[], setter: (v: string[]) => void, input: string, clearInput: () => void) => {
    if (input.trim()) { setter([...list, input.trim()]); clearInput(); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Update Plan" : "Add Plan"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Plan Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Badge (Optional)</Label><Input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Most Popular" /></div>
            <div className="space-y-2"><Label>Price (Monthly)</Label><Input value={form.priceMonthly} onChange={e => setForm({ ...form, priceMonthly: e.target.value })} placeholder="$49" required /></div>
            <div className="space-y-2"><Label>Price (Quarterly)</Label><Input value={form.priceQuarterly} onChange={e => setForm({ ...form, priceQuarterly: e.target.value })} placeholder="$39" /></div>
            <div className="space-y-2"><Label>Period</Label><Input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="month" required /></div>
            <div className="space-y-2"><Label>CTA Text</Label><Input value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} required /></div>
            <div className="space-y-2"><Label>CTA Link</Label><Input value={form.ctaHref} onChange={e => setForm({ ...form, ctaHref: e.target.value })} required /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-2"><Label>Tagline</Label><Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Ideal For</Label><Input value={form.idealFor} onChange={e => setForm({ ...form, idealFor: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} required /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="popular" checked={!!form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} />
            <Label htmlFor="popular">Mark as Popular</Label>
          </div>

          {/* Features */}
          <div className="space-y-2 p-3 border border-border rounded-md bg-card">
            <Label className="font-semibold">Features Included</Label>
            {features.map((f, i) => (
              <div key={i} className="flex gap-2"><Input value={f} onChange={e => { const n = [...features]; n[i] = e.target.value; setFeatures(n); }} /><Button type="button" variant="ghost" size="icon" onClick={() => setFeatures(features.filter((_, j) => j !== i))}><X className="w-4 h-4 text-destructive" /></Button></div>
            ))}
            <div className="flex gap-2">
              <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Add feature..." onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addToList(features, setFeatures, featureInput, () => setFeatureInput("")); } }} />
              <Button type="button" variant="outline" onClick={() => addToList(features, setFeatures, featureInput, () => setFeatureInput(""))}>Add</Button>
            </div>
          </div>

          {/* Not Included */}
          <div className="space-y-2 p-3 border border-border rounded-md bg-card">
            <Label className="font-semibold">Not Included</Label>
            {notIncluded.map((n, i) => (
              <div key={i} className="flex gap-2"><Input value={n} onChange={e => { const arr = [...notIncluded]; arr[i] = e.target.value; setNotIncluded(arr); }} /><Button type="button" variant="ghost" size="icon" onClick={() => setNotIncluded(notIncluded.filter((_, j) => j !== i))}><X className="w-4 h-4 text-destructive" /></Button></div>
            ))}
            <div className="flex gap-2">
              <Input value={notIncludedInput} onChange={e => setNotIncludedInput(e.target.value)} placeholder="Add not included item..." onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addToList(notIncluded, setNotIncluded, notIncludedInput, () => setNotIncludedInput("")); } }} />
              <Button type="button" variant="outline" onClick={() => addToList(notIncluded, setNotIncluded, notIncludedInput, () => setNotIncludedInput(""))}>Add</Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating}>{isCreating || isUpdating ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
