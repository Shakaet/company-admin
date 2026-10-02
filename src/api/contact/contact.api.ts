import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams } from "@/interface/common-interface";

export interface IContact {
  _id: string;
  inquiryType: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  requestNda: boolean;
  status?: "pending" | "resolved";
  createdAt?: string;
}

interface ContactListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    data: IContact[];
    total: number;
    page: number;
    limit: number;
  };
}

export const useGetContactsForAdmin = (params: GetParams) =>
  useQuery<ContactListResponse>({
    queryKey: ["admin_contacts", params],
    queryFn: async () => (await api.get("/contact", { params })).data,
  });

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/contact/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_contacts"] }),
  });
};
