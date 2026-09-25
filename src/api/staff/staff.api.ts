import type {
  GetParams,
  IResponse,
  Status,
} from "@/interface/common-interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { IRole } from "../role/role.api";

export interface IStaff {
  _id: string;
  admin_name: string;
  admin_phone: string;
  admin_password: string;
  admin_status: Status;
  admin_role_id: IRole | string;
  publisher_id: any;
  updated_id?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  admin_name: string;
  admin_phone: string;
  admin_password: string;
  admin_status: Status;
  admin_role_id: string;
  publisher_id?: string;
}

export interface UpdateStaffPayload {
  _id: string;
  admin_name?: string;
  admin_phone?: string;
  admin_password?: string;
  admin_status?: Status;
  admin_role_id?: string;
  updated_id?: any;
}

//! GET ALL STAFFS

const getAllStaffsApi = async (
  params: GetParams = {},
): Promise<IResponse<IStaff[]>> => {
  const { data } = await api.get("/admin/admin", {
    params,
  });
  return data;
};

export const useGetStaffs = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => getAllStaffsApi(params),
  });
};

// ! create staff

const createStaffApi = async (payload: CreateStaffPayload) => {
  const { data } = await api.post("/admin/admin", payload);
  return data;
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createStaff"],
    mutationFn: (payload: CreateStaffPayload) => createStaffApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// ! UPDATE STAFF (id in request body)

const updateStaffApi = async (payload: UpdateStaffPayload) => {
  const { data } = await api.patch("/admin/admin", payload);
  return data;
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateStaff"],
    mutationFn: (payload: UpdateStaffPayload) => updateStaffApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// ! DELETE STAFF

const deleteStaffApi = async (_id: string) => {
  const { data } = await api.delete("/admin/admin", {
    data: { _id },
  });
  return data;
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteStaff"],
    mutationFn: (_id: string) => deleteStaffApi(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
