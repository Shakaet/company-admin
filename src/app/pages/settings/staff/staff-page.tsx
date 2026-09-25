import { useGetStaffs } from "@/api/staff/staff.api";
import Staff from "@/components/modules/staff/staff";
import useSerial from "@/helper/use-serial";
import { useState } from "react";

const StaffPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [update, setUpdate] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);

  const { data, isLoading, refetch } = useGetStaffs({
    page,
    limit,
    searchTerm,
  });

  const serial = useSerial(page, limit);

  const handleUpdate = async (payload: any) => {
    setUpdate(payload);
    setUpdateModal(true);
  };

  return (
    <section>
      <Staff
        data={data?.data}
        isLoading={isLoading}
        total={data?.totalData || 0}
        refetch={refetch}
        serial={serial}
        handleUpdate={handleUpdate}
        update={update}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setUpdateModal={setUpdateModal}
        updateModal={updateModal}
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        setSearchTerm={setSearchTerm}
      />
    </section>
  );
};

export default StaffPage;
