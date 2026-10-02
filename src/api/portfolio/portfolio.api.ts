import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams, IResponse } from "@/interface/common-interface";

export interface IPortfolioHighlight {
  _id?: string;
  icon: string;
  value: string;
  label: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IProjectCategory {
  _id?: string;
  name: string;
  value: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IProject {
  _id?: string;
  title: string;
  slug?: string;
  category: string;
  image: string;
  image_key?: string;
  client: string;
  year?: string;
  description: string;
  liveUrl?: string;
  tags: string[];
  metrics?: { value: string; label: string };
  featured?: boolean;
  status: "active" | "inactive";
  createdAt?: string;
}

// --- Highlights ---
export const useGetHighlightsForAdmin = (params: GetParams) =>
  useQuery<IResponse<IPortfolioHighlight[]>>({
    queryKey: ["admin_portfolio_highlights", params],
    queryFn: async () => (await api.get("/portfolio/admin/highlights", { params })).data,
  });

export const useCreateHighlight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IPortfolioHighlight>) =>
      (await api.post("/portfolio/highlights", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_highlights"] }),
  });
};

export const useUpdateHighlight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IPortfolioHighlight> }) =>
      (await api.patch(`/portfolio/highlights/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_highlights"] }),
  });
};

export const useDeleteHighlight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/portfolio/highlights/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_highlights"] }),
  });
};

// --- Categories ---
export const useGetCategoriesForAdmin = (params: GetParams) =>
  useQuery<IResponse<IProjectCategory[]>>({
    queryKey: ["admin_portfolio_categories", params],
    queryFn: async () => (await api.get("/portfolio/admin/categories", { params })).data,
  });

export const useGetAllCategories = () =>
  useQuery<IResponse<IProjectCategory[]>>({
    queryKey: ["portfolio_categories_all"],
    queryFn: async () => (await api.get("/portfolio/categories")).data,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IProjectCategory>) =>
      (await api.post("/portfolio/categories", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_categories"] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IProjectCategory> }) =>
      (await api.patch(`/portfolio/categories/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_categories"] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/portfolio/categories/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_categories"] }),
  });
};

// --- Projects ---
export const useGetProjectsForAdmin = (params: GetParams) =>
  useQuery<IResponse<IProject[]>>({
    queryKey: ["admin_portfolio_projects", params],
    queryFn: async () => (await api.get("/portfolio/admin/projects", { params })).data,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) =>
      (await api.post("/portfolio/projects", payload, { headers: { "Content-Type": "multipart/form-data" } })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_projects"] }),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) =>
      (await api.patch(`/portfolio/projects/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_projects"] }),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/portfolio/projects/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_portfolio_projects"] }),
  });
};
