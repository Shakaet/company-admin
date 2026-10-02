import { useState } from "react";
import { useGetConsultationsForAdmin, useUpdateConsultationStatus } from "@/api/service/service.api";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import Header from "@/components/custom/header";
import PaginationCustom from "@/components/custom/pagination";
import useSerial from "@/helper/use-serial";

export default function ConsultationListPage() {
  const [page, setPage] = useState(1);
  const serial = useSerial(page, 10);
  const { data, isLoading } = useGetConsultationsForAdmin({ page, limit: 10 });
  const { can } = useAdminPermission();
  const { mutate: updateStatus } = useUpdateConsultationStatus();

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-6">
      <Header title="Consultation Requests" description="Manage client consultation requests" />

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={5} rows={6} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">No consultation requests yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">They will appear here once clients submit requests</p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Client Details</TableHead>
                  <TableHead className="font-semibold text-center">Service</TableHead>
                  <TableHead className="font-semibold">Project Info</TableHead>
                  <TableHead className="font-semibold text-center">Date</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <TableRow key={item._id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                    <TableCell className="text-center font-medium text-muted-foreground">{serial(index)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                        {item.phone && <p className="text-xs text-muted-foreground">{item.phone}</p>}
                        {item.company && <p className="text-xs text-muted-foreground">{item.company}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.serviceTitle}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Budget:</span> {item.budget}</p>
                        <p><span className="text-muted-foreground">Timeline:</span> {item.timeline}</p>
                        <p className="text-muted-foreground truncate max-w-[200px]" title={item.projectDetails}>{item.projectDetails}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{DateFormat(item.createdAt)}</TableCell>
                    <TableCell className="text-center">
                      <Select
                        disabled={!can("service_update")}
                        value={item.status}
                        onValueChange={(val) => updateStatus({ id: item._id, status: val })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <PaginationCustom currentPage={page} onPageChange={setPage} totalPages={Math.ceil(total / 10)} />
    </div>
  );
}
