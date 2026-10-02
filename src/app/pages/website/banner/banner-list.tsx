import { useGetBanner } from "@/api/banner/banner.api";
import CreateButton from "@/components/custom/create-button";
import Header from "@/components/custom/header";
import BannerCreate from "@/components/modules/banner/banner-create";
import BannerTable from "@/components/modules/banner/banner-table";
import BannerUpdate from "@/components/modules/banner/banner-update";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { useState } from "react";

export default function BannerList() {
  const { data, isLoading } = useGetBanner();
  const { can } = useAdminPermission();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setUpdateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Header title="Banners" description="Manage homepage slider images" />
        {can("banner_create") && (
          <CreateButton
            onClick={() => setCreateModalOpen(true)}
            label="Create Banner"
          />
        )}
      </div>

      <BannerTable
        bannerData={data?.data || []}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <BannerCreate
        open={createModalOpen}
        onClose={setCreateModalOpen}
      />

      {editingBanner && (
        <BannerUpdate
          open={updateModalOpen}
          onClose={setUpdateModalOpen}
          data={editingBanner}
        />
      )}
    </div>
  );
}
