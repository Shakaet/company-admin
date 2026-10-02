import type { GetParams, IResponse } from "@/interface/common-interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";

export interface IBanner {
  _id: string;
  banner_image: string;
  status: "active" | "inactive";
  createdAt?: string;
}

// GET ALL
const getBannerApi = async (params: GetParams = {}): Promise<IResponse<IBanner[]>> => {
  const response = await api.get<IResponse<IBanner[]>>("/banner/admin", { params });
  return response.data;
};
export const useGetBanner = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["banner", params],
    queryFn: () => getBannerApi(params),
  });
};

// CREATE
const createBannerApi = async (payload: FormData) => {
  const response = await api.post("/banner", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => createBannerApi(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banner"] }),
  });
};

// UPDATE
const updateBannerApi = async (id: string, payload: FormData) => {
  const response = await api.patch(`/banner/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) => updateBannerApi(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banner"] }),
  });
};

// TOGGLE STATUS
const toggleBannerStatusApi = async (id: string) => {
  const response = await api.patch(`/banner/${id}/toggle-status`);
  return response.data;
};
export const useToggleBannerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleBannerStatusApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banner"] }),
  });
};

// DELETE
const deleteBannerApi = async (id: string) => {
  const response = await api.delete(`/banner/${id}`);
  return response.data;
};
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBannerApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banner"] }),
  });
};
