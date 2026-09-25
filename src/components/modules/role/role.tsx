import Pagination from "@/components/custom/pagination";
import { SearchField } from "@/components/custom/search-field";
import { useAdminPermission } from "@/helper/use-admin-permission";
import CreateButton from "../../custom/create-button";
import Header from "../../custom/header";
import RoleCreate from "./role-create";
import RoleTable from "./role-table";
import RoleUpdate from "./role-update";

type RoleProps = {
  roleData: any;
  isLoading: boolean;
  refetch: () => void;
  updateRole: any;
  handleUpdate: (payload: any) => void;
  roleModalOpen: boolean;
  setRoleModalOpen: (open: boolean) => void;
  setUpdateModalOpen: (open: boolean) => void;
  updateModalOpen: boolean;
  admin: any;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  serial: (index: number) => number;
  total: number;
};

const Role = ({
  roleData,
  isLoading,
  refetch,
  updateRole,
  handleUpdate,
  roleModalOpen,
  setRoleModalOpen,
  setUpdateModalOpen,
  updateModalOpen,
  admin,
  page,
  setPage,
  limit,
  setLimit,
  setSearchTerm,
  serial,
  total,
}: RoleProps) => {
  const { can } = useAdminPermission();
  return (
    <section className="space-y-6 w-full">
      {/* //? Header  */}
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5">
          {/* //? Header */}
          <Header title={"Role"} description={"Manage all role"} />

          {/* //? Create Button */}
          {can("admin_role_create") && (
            <CreateButton
              label="Create Role"
              onClick={() => setRoleModalOpen(true)}
            />
          )}
        </div>
      </div>

      <div className="w-full max-w-sm overflow-hidden">
        <SearchField
          placeholder="Search role..."
          onSearch={(v) => {
            setPage(1);
            setSearchTerm(v);
          }}
        />
      </div>

      {/* //? Modal */}
      <RoleTable
        roleData={roleData}
        isLoading={isLoading}
        handleUpdate={handleUpdate}
        refetch={refetch}
        can={can}
        serial={serial}
      />

      <Pagination
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        total={total}
      />
      {/* //? Create Modal */}
      {can("admin_role_create") && (
        <RoleCreate
          refetch={refetch}
          open={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          admin={admin}
        />
      )}

      {/* //? Update Modal */}
      {can("admin_role_update") && (
        <RoleUpdate
          open={updateModalOpen}
          setOpen={() => setUpdateModalOpen(false)}
          roleData={updateRole}
          refetch={refetch}
          admin={admin}
        />
      )}
    </section>
  );
};

export default Role;
