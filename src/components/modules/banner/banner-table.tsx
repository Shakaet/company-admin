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
  const { mutateAsync: deleteBanner, isPending: deleteLoading } = useDeleteBanner();
  const { mutateAsync: toggleStatus, isPending: statusLoading } = useToggleBannerStatus();

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-center font-semibold">Image</TableHead>
            <TableHead className="text-center font-semibold">Status</TableHead>
            <TableHead className="text-center font-semibold">Created At</TableHead>
            {(can("banner_update") || can("banner_delete")) && (
              <TableHead className="text-right font-semibold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <TableSkeleton rows={5} columns={4} />
              </TableCell>
            </TableRow>
          ) : bannerData?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                No banners found.
              </TableCell>
            </TableRow>
          ) : (
            bannerData.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <div className="mx-auto w-32 h-16 relative rounded-md overflow-hidden bg-slate-100 border flex items-center justify-center">
                    {banner.banner_image ? (
                      <img
                        src={banner.banner_image}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
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
                    <Badge variant={banner.status === "active" ? "default" : "secondary"}>
                      {banner.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">{DateFormat(banner.createdAt)}</TableCell>
                {(can("banner_update") || can("banner_delete")) && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {can("banner_update") && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(banner)}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                      {can("banner_delete") && (
                        <DeleteButton
                          onDelete={() => deleteBanner(banner._id)}
                          disabled={deleteLoading}
                        />
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BannerTable;
