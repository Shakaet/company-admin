import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams, IPaginatedResponse } from "@/interface/common-interface";

export interface ICareerJob {
  _id?: string;
  title: string;
  department: string;
  type: string;
  workplaceType: string;
  location: string;
  experience: string;
  salary: string;
  deadline: string;
  postedDate: string;
  featured?: boolean;
  urgent?: boolean;
  description: string;
  aboutRole?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  techStack: string[];
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IJobApplication {
  _id?: string;
  jobId?: string;
  jobTitle: string;
  department?: string;
  fullName: string;
  email: string;
  phone?: string;
  portfolioUrl?: string;
  experience: string;
  expectedSalary?: string;
  noticePeriod: string;
  resumeLink: string;
  coverLetter?: string;
  agreeConsent: boolean;
  status: "pending" | "reviewed" | "rejected" | "hired";
  createdAt?: string;
}

// --- Jobs ---
export const useGetJobsForAdmin = (params: GetParams) =>
  useQuery<IPaginatedResponse<ICareerJob>>({
    queryKey: ["admin_career_jobs", params],
    queryFn: async () => (await api.get("/career/admin/jobs", { params })).data,
  });

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ICareerJob>) =>
      (await api.post("/career/jobs", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_career_jobs"] }),
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ICareerJob> }) =>
      (await api.patch(`/career/jobs/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_career_jobs"] }),
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/career/jobs/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_career_jobs"] }),
  });
};

// --- Applications ---
export const useGetApplicationsForAdmin = (params: GetParams & { jobId?: string }) =>
  useQuery<IPaginatedResponse<IJobApplication>>({
    queryKey: ["admin_career_applications", params],
    queryFn: async () => (await api.get("/career/applications", { params })).data,
  });

export const useUpdateApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      (await api.patch(`/career/applications/${id}`, { status })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_career_applications"] }),
  });
};
