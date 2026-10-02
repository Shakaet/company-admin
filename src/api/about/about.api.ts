import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams, IPaginatedResponse, ISingleResponse } from "@/interface/common-interface";

export interface IOurCompany {
  _id?: string;
  stats?: { value: string; label: string }[];
  story?: string[];
  values?: { icon: string; title: string; desc: string }[];
}

export interface IOurTeam {
  _id?: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IFounderMessage {
  _id?: string;
  name: string;
  role: string;
  image?: string;
  message?: string;
  shortDesc?: string;
  highlightQuote?: string;
  stats?: { value: string; label: string }[];
  paragraphs?: string[];
  commitments?: string[];
}

// ----------------------------------------------------------------------------
// OUR COMPANY
// ----------------------------------------------------------------------------
export const useGetCompany = () => {
  return useQuery({
    queryKey: ["about_company"],
    queryFn: async (): Promise<ISingleResponse<IOurCompany>> => {
      const response = await api.get("/about/admin/company");
      return response.data;
    },
  });
};

export const useCreateOrUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IOurCompany>) => {
      const response = await api.post("/about/company", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about_company"] }),
  });
};

// ----------------------------------------------------------------------------
// OUR TEAM
// ----------------------------------------------------------------------------
export const useGetTeamMembers = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["about_team", params],
    queryFn: async (): Promise<IPaginatedResponse<IOurTeam>> => {
      const response = await api.get("/about/admin/team", { params });
      return response.data;
    },
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await api.post("/about/team", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about_team"] }),
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) => {
      const response = await api.patch(`/about/team/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about_team"] }),
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/about/team/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about_team"] }),
  });
};

// ----------------------------------------------------------------------------
// FOUNDER MESSAGE
// ----------------------------------------------------------------------------
export const useGetFounderMessage = () => {
  return useQuery({
    queryKey: ["about_founder"],
    queryFn: async (): Promise<ISingleResponse<IFounderMessage>> => {
      const response = await api.get("/about/admin/founder-message");
      return response.data;
    },
  });
};

export const useCreateOrUpdateFounderMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await api.post("/about/founder-message", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about_founder"] }),
  });
};
