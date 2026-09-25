import { useMemo } from "react";

const useSerial = (page: number, limit: number) => {
  return useMemo(() => {
    return (index: number) => (page - 1) * limit + index + 1;
  }, [page, limit]);
};

export default useSerial;
