import type { GetParams, IPaginatedResponse } from "@/interface/common-interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";

// ----------------------------------------------------------------------------
// INTERFACES
// ----------------------------------------------------------------------------

export interface IPartner {
  _id: string;
  name: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface ITechStack {
  _id: string;
  name: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IStat {
  _id: string;
  label: string;
  value: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  projectTag?: string;
  message: string;
  highlightMetric?: { value: string; label: string };
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IWhyChooseUs {
  _id: string;
  icon: string;
  badge: string;
  title: string;
  desc: string;
  perks: string[];
  status: "active" | "inactive";
  createdAt?: string;
}

// ----------------------------------------------------------------------------
// PARTNERS
// ----------------------------------------------------------------------------
export const useGetPartners = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["partners", params],
    queryFn: async (): Promise<IPaginatedResponse<IPartner>> => {
      const response = await api.get("/home-elements/admin/partners", { params });
      return response.data;
    },
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IPartner>) => {
      const response = await api.post("/home-elements/partners", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IPartner> }) => {
      const response = await api.patch(`/home-elements/partners/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/home-elements/partners/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });
};

// ----------------------------------------------------------------------------
// TECH STACK
// ----------------------------------------------------------------------------
export const useGetTechStacks = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["techStacks", params],
    queryFn: async (): Promise<IPaginatedResponse<ITechStack>> => {
      const response = await api.get("/home-elements/admin/tech-stack", { params });
      return response.data;
    },
  });
};

export const useCreateTechStack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ITechStack>) => {
      const response = await api.post("/home-elements/tech-stack", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["techStacks"] }),
  });
};

export const useUpdateTechStack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ITechStack> }) => {
      const response = await api.patch(`/home-elements/tech-stack/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["techStacks"] }),
  });
};

export const useDeleteTechStack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/home-elements/tech-stack/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["techStacks"] }),
  });
};

// ----------------------------------------------------------------------------
// STATS
// ----------------------------------------------------------------------------
export const useGetStats = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["stats", params],
    queryFn: async (): Promise<IPaginatedResponse<IStat>> => {
      const response = await api.get("/home-elements/admin/stats", { params });
      return response.data;
    },
  });
};

export const useCreateStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IStat>) => {
      const response = await api.post("/home-elements/stats", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stats"] }),
  });
};

export const useUpdateStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IStat> }) => {
      const response = await api.patch(`/home-elements/stats/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stats"] }),
  });
};

export const useDeleteStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/home-elements/stats/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stats"] }),
  });
};

// ----------------------------------------------------------------------------
// TESTIMONIALS
// ----------------------------------------------------------------------------
export const useGetTestimonials = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["testimonials", params],
    queryFn: async (): Promise<IPaginatedResponse<ITestimonial>> => {
      const response = await api.get("/home-elements/admin/testimonials", { params });
      return response.data;
    },
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ITestimonial>) => {
      const response = await api.post("/home-elements/testimonials", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ITestimonial> }) => {
      const response = await api.patch(`/home-elements/testimonials/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/home-elements/testimonials/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
  });
};

// ----------------------------------------------------------------------------
// WHY CHOOSE US
// ----------------------------------------------------------------------------
export const useGetWhyChooseUs = (params: GetParams = {}) => {
  return useQuery({
    queryKey: ["whyChooseUs", params],
    queryFn: async (): Promise<IPaginatedResponse<IWhyChooseUs>> => {
      const response = await api.get("/home-elements/admin/why-choose-us", { params });
      return response.data;
    },
  });
};

export const useCreateWhyChooseUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IWhyChooseUs>) => {
      const response = await api.post("/home-elements/why-choose-us", payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] }),
  });
};

export const useUpdateWhyChooseUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IWhyChooseUs> }) => {
      const response = await api.patch(`/home-elements/why-choose-us/${id}`, payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] }),
  });
};

export const useDeleteWhyChooseUs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/home-elements/why-choose-us/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["whyChooseUs"] }),
  });
};
