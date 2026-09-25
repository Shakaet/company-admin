import { useGetRolesDashboard } from "@/api/role/role.api";
import Role from "@/components/modules/role/role";
import { useAuth } from "@/context/auth-context";
import useSerial from "@/helper/use-serial";
import { useState } from "react";

const RolePage = () => {
  const { admin } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [updateRole, setUpdateRole] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetRolesDashboard({
    page,
    limit,
    searchTerm,
  });

  // todo handle role update
  const handleUpdate = async (payload: any) => {
    setUpdateRole(payload);
    setUpdateModalOpen(true);
  };

  const serial = useSerial(page, limit);

  return (
    <section>
      <Role
        roleData={data?.data}
        isLoading={isLoading}
        refetch={refetch}
        handleUpdate={handleUpdate}
        updateRole={updateRole}
        roleModalOpen={roleModalOpen}
        setRoleModalOpen={setRoleModalOpen}
        setUpdateModalOpen={setUpdateModalOpen}
        updateModalOpen={updateModalOpen}
        admin={admin}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        setSearchTerm={setSearchTerm}
        serial={serial}
        total={data?.totalData || 0}
      />
    </section>
  );
};

export default RolePage;
