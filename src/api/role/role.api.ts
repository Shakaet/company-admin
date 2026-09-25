import type {
  GetParams,
  IResponse,
  Status,
} from "@/interface/common-interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";

export interface IRole {
  _id: string;
  admin_role_name: string;
  permissions: string[];
  admin_role_status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRolePayload {
  admin_role_name: string;
  permissions: string[];
  admin_role_status: Status;
  publisher_id?: string;
}

export interface UpdateRolePayload {
  _id: string;
  admin_role_name?: string;
  permissions?: string[];
  admin_role_status?: Status;
  updated_id?: string;
}

// ! GET ALL ROLES

const getAllRolesApi = async (
  params: GetParams = {},
): Promise<IResponse<IRole>> => {
  const response = await api.get<IResponse<IRole>>("/admin_role", {
    params,
  });
  return response.data;
};

export const useGetRoles = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => getAllRolesApi(params),
  });
};

const getAllRolesDashboardApi = async (
  params: GetParams = {},
): Promise<IResponse<IRole>> => {
  const response = await api.get<IResponse<IRole>>("/admin_role/admin", {
    params,
  });
  return response.data;
};

export const useGetRolesDashboard = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => getAllRolesDashboardApi(params),
  });
};

// ! CREATE ROLE

const createRoleApi = async (payload: CreateRolePayload) => {
  const response = await api.post("/admin_role/admin", payload);
  return response.data;
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createRole"],
    mutationFn: (payload: CreateRolePayload) => createRoleApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

// ! UPDATE ROLE (id in request body)

const updateRoleApi = async (payload: UpdateRolePayload) => {
  const response = await api.patch("/admin_role/admin", payload);
  return response.data;
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateRole"],
    mutationFn: (payload: UpdateRolePayload) => updateRoleApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

// ! DELETE ROLE
const deleteRoleApi = async (_id: string) => {
  const response = await api.delete("/admin_role/admin", {
    data: { _id },
  });
  return response.data;
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: (id: string) => deleteRoleApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
