import { useState } from "react";
import {
  useGetApplicationsForAdmin,
  useUpdateApplicationStatus,
} from "@/api/career/career.api";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import PaginationCustom from "@/components/custom/pagination";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { DateFormat } from "@/hooks/use-date-format";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSerial from "@/helper/use-serial";

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  reviewed: "default",
  rejected: "destructive",
  hired: "secondary",
};

export default function CareerApplicationsTab() {
  const [page, setPage] = useState(1);
  const serial = useSerial(page, 10);
  const { data, isLoading } = useGetApplicationsForAdmin({ page, limit: 10 });
  const { can } = useAdminPermission();
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const items = data?.data?.data || [];
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 pt-4">
      <div>
        <h2 className="text-lg font-semibold">Job Applications</h2>
        <p className="text-sm text-muted-foreground">
          Review and manage incoming candidate applications
        </p>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton columns={5} rows={5} />
          ) : !items.length ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No applications yet
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Applications will appear here once candidates apply
                </p>
              </div>
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="w-16 text-center font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Applicant</TableHead>
                  <TableHead className="font-semibold">Job Applied</TableHead>
                  <TableHead className="font-semibold text-center">Experience</TableHead>
                  <TableHead className="font-semibold text-center">Resume</TableHead>
                  <TableHead className="font-semibold text-center">Applied Date</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <TableCell className="text-center font-medium text-muted-foreground">{serial(index)}</TableCell>
                    <TableCell>
                      <p className="font-medium">{item.fullName}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                      {item.phone && (
                        <p className="text-xs text-muted-foreground">{item.phone}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{item.jobTitle}</p>
                      {item.department && (
                        <p className="text-xs text-muted-foreground">
                          {item.department}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.experience}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={item.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-xs">View</span>
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {DateFormat(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Select
                          disabled={!can("career_update")}
                          value={item.status}
                          onValueChange={(val) =>
                            updateStatus({ id: item._id, status: val })
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
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
    </div>
  );
}
