import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams, IPaginatedResponse } from "@/interface/common-interface";

export interface IPricingPlan {
  _id?: string;
  name: string;
  badge?: string;
  popular?: boolean;
  priceMonthly: string;
  priceQuarterly?: string;
  period: string;
  tagline: string;
  description: string;
  idealFor: string;
  features: string[];
  notIncluded: string[];
  ctaText: string;
  ctaHref: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IPricingGuarantee {
  _id?: string;
  icon: string;
  label: string;
  desc: string;
  status: "active" | "inactive";
  createdAt?: string;
}

// --- Plans ---
export const useGetPlansForAdmin = (params: GetParams) =>
  useQuery<IPaginatedResponse<IPricingPlan>>({
    queryKey: ["admin_pricing_plans", params],
    queryFn: async () => (await api.get("/pricing/admin/plans", { params })).data,
  });

export const useCreatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IPricingPlan>) =>
      (await api.post("/pricing/plans", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_pricing_plans"] }),
  });
};

export const useUpdatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IPricingPlan> }) =>
      (await api.patch(`/pricing/plans/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_pricing_plans"] }),
  });
};

export const useDeletePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/pricing/plans/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_pricing_plans"] }),
  });
};

// --- Guarantees ---
export const useGetGuaranteesForAdmin = (params: GetParams) =>
  useQuery<IPaginatedResponse<IPricingGuarantee>>({
    queryKey: ["admin_pricing_guarantees", params],
    queryFn: async () => (await api.get("/pricing/admin/guarantees", { params })).data,
  });

export const useCreateGuarantee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IPricingGuarantee>) =>
      (await api.post("/pricing/guarantees", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_pricing_guarantees"] }),
  });
};

export const useUpdateGuarantee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IPricingGuarantee> }) =>
      (await api.patch(`/pricing/guarantees/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_pricing_guarantees"] }),
  });
};

export const useDeleteGuarantee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/pricing/guarantees/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_pricing_guarantees"] }),
  });
};
