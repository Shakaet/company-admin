import type { IStaff } from "@/api/staff/staff.api";
import CreateButton from "@/components/custom/create-button";
import Header from "@/components/custom/header";
import Pagination from "@/components/custom/pagination";
import { SearchField } from "@/components/custom/search-field";
import { useAdminPermission } from "@/helper/use-admin-permission";
import StaffCreate from "./staff-create";
import StaffTable from "./staff-table";
import StaffUpdate from "./staff-update";

type StaffProps = {
  data: any;
  isLoading: boolean;
  refetch: () => void;
  total: number;
  serial: (index: number) => number;
  update: IStaff | null;
  handleUpdate: (payload: any) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateModal: boolean;
  page: number;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const Staff = ({
  data,
  isLoading,
  refetch,
  total,
  serial,
  update,
  handleUpdate,
  setPage,
  modalOpen,
  setModalOpen,
  setUpdateModal,
  updateModal,
  page,
  limit,
  setLimit,
  setSearchTerm,
}: StaffProps) => {
  const { can } = useAdminPermission();
  return (
    <section className="space-y-6 w-full">
      {/* //? Header  */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5">
          {/* //? Header */}
          <Header title={"Admin"} description={"Manage all admin"} />
          {/* //? Create Button */}
          {can("admin_create") && (
            <CreateButton
              label="Create Admin"
              onClick={() => setModalOpen(true)}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-sm overflow-hidden">
        <SearchField
          placeholder="Search admins..."
          onSearch={(v) => {
            setPage(1);
            setSearchTerm(v);
          }}
        />
      </div>

      {/* //?  */}
      <StaffTable
        data={data}
        isLoading={isLoading}
        serial={serial}
        handleUpdate={handleUpdate}
        refetch={refetch}
        can={can}
      />

      {/* //? Create Modal */}
      {can("admin_create") && (
        <StaffCreate
          refetch={refetch}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* //? Update Modal */}
      {can("admin_update") && (
        <StaffUpdate
          open={updateModal}
          setOpen={setUpdateModal}
          staffData={update}
          refetch={refetch}
        />
      )}

      {/* //? Pagination  */}
      <Pagination
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        total={total}
      />
    </section>
  );
};

export default Staff;
