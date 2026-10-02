import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams, IPaginatedResponse } from "@/interface/common-interface";

export interface IService {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  badge?: string;
  icon: string;
  heroHeadline?: string;
  description: string;
  features: string[];
  deliverables?: string[];
  benefits?: { title: string; desc: string }[];
  techStack?: string[];
  process?: { step: string; title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  pricingStartingAt?: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IServiceConsultation {
  _id?: string;
  serviceTitle: string;
  serviceSlug: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget: string;
  timeline: string;
  projectDetails: string;
  status: "pending" | "contacted" | "closed";
  createdAt?: string;
}

// ----------------------------------------------------------------------------
// SERVICES
// ----------------------------------------------------------------------------
export const useGetServicesForAdmin = (params: GetParams) => {
  return useQuery<IPaginatedResponse<IService>>({
    queryKey: ["admin_services", params],
    queryFn: async () => {
      const response = await api.get("/services/admin", { params });
      return response.data;
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await api.post("/services", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_services"] }),
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) => {
      const response = await api.patch(`/services/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_services"] }),
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_services"] }),
  });
};

// ----------------------------------------------------------------------------
// CONSULTATIONS
// ----------------------------------------------------------------------------
export const useGetConsultationsForAdmin = (params: GetParams) => {
  return useQuery<IPaginatedResponse<IServiceConsultation>>({
    queryKey: ["admin_consultations", params],
    queryFn: async () => {
      const response = await api.get("/services/admin/consultations", { params });
      return response.data;
    },
  });
};

export const useUpdateConsultationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/services/admin/consultations/${id}`, { status });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_consultations"] }),
  });
};
