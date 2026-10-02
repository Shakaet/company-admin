import { useGetBanner } from "@/api/banner/banner.api";
import CreateButton from "@/components/custom/create-button";
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
          <p className="text-slate-500 text-sm mt-1">Manage homepage slider images</p>
        </div>
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
