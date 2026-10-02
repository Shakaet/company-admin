import { useGetConsultationsForAdmin, useUpdateConsultationStatus } from "@/api/service/service.api";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationCustom from "@/components/custom/pagination";

export default function ConsultationListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetConsultationsForAdmin({ page, limit: 10 });
  const { can } = useAdminPermission();
  const { mutate: updateStatus } = useUpdateConsultationStatus();

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Consultation Requests</h2>
          <p className="text-sm text-slate-500">Manage client consultation requests</p>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Client Details</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="text-left">Project Info</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No consultation requests found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.data?.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="text-left">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                      {item.phone && <p className="text-xs text-slate-500">{item.phone}</p>}
                      {item.company && <p className="text-xs text-slate-500">{item.company}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{item.serviceTitle}</Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="space-y-1">
                      <p className="text-xs"><strong>Budget:</strong> {item.budget}</p>
                      <p className="text-xs"><strong>Timeline:</strong> {item.timeline}</p>
                      <p className="text-xs truncate max-w-[200px]" title={item.projectDetails}>
                        {item.projectDetails}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {DateFormat(item.createdAt)}
                  </TableCell>
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
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <PaginationCustom
          currentPage={page}
          onPageChange={(p) => setPage(p)}
          totalPages={Math.ceil((data?.data?.total || 0) / 10)}
        />
      </div>
    </div>
  );
}
