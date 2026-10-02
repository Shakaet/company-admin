import { useDeleteBanner, useToggleBannerStatus } from "@/api/banner/banner.api";
import { Badge } from "@/components/ui/badge";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateFormat } from "@/hooks/use-date-format";
import { Image as ImageIcon, Pencil } from "lucide-react";
import DeleteButton from "../../custom/delete-button";
import TableSkeleton from "../../skeleton/table-skeleton";

const BannerTable = ({
  bannerData = [],
  isLoading,
  onEdit,
}: {
  bannerData: any[];
  isLoading: boolean;
  onEdit: (banner: any) => void;
}) => {
  const { can } = useAdminPermission();
  const { mutateAsync: deleteBanner } = useDeleteBanner();
  const { mutateAsync: toggleStatus, isPending: statusLoading } =
    useToggleBannerStatus();

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton columns={4} rows={5} />
        ) : bannerData?.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">No banners found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Upload a new banner to get started
              </p>
            </div>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="text-center font-semibold">Image</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">Created At</TableHead>
                {(can("banner_update") || can("banner_delete")) && (
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bannerData.map((banner) => (
                <TableRow
                  key={banner._id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                >
                  <TableCell>
                    <div className="mx-auto w-32 h-16 relative rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center">
                      {banner.banner_image ? (
                        <img
                          src={banner.banner_image}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch
                        checked={banner.status === "active"}
                        onCheckedChange={() => toggleStatus(banner._id)}
                        disabled={statusLoading || !can("banner_update")}
                      />
                      <Badge
                        variant={
                          banner.status === "active" ? "default" : "secondary"
                        }
                      >
                        {banner.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {DateFormat(banner.createdAt)}
                  </TableCell>
                  {(can("banner_update") || can("banner_delete")) && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {can("banner_update") && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit(banner)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {can("banner_delete") && (
                          <DeleteButton
                            title="Delete Banner"
                            description="This banner image will be permanently deleted."
                            onDelete={async () => {
                              await deleteBanner(banner._id);
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
  );
};

export default BannerTable;
