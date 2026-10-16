import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { GetParams, IResponse } from "@/interface/common-interface";

export interface IBlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover?: string;
  author: string;
  authorBio?: string;
  date: string;
  category: string | { _id: string; name: string; slug: string };
  readTime?: number;
  featured?: boolean;
  status: "active" | "inactive";
  createdAt?: string;
}

export interface IBlogCategory {
  _id?: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export const useGetBlogCategoriesForAdmin = (params: GetParams) =>
  useQuery<{ data: IBlogCategory[]; totalData?: number }>({
    queryKey: ["admin_blog_categories", params],
    queryFn: async () => (await api.get("/blog/admin/categories", { params })).data,
  });

export const useGetBlogCategories = () =>
  useQuery<{ data: IBlogCategory[] }>({
    queryKey: ["blog_categories"],
    queryFn: async () => (await api.get("/blog/categories")).data,
  });

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IBlogCategory>) =>
      (await api.post("/blog/categories", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blog_categories"] });
      queryClient.invalidateQueries({ queryKey: ["blog_categories"] });
    },
  });
};

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IBlogCategory> }) =>
      (await api.patch(`/blog/categories/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blog_categories"] });
      queryClient.invalidateQueries({ queryKey: ["blog_categories"] });
    },
  });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/blog/categories/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_blog_categories"] });
      queryClient.invalidateQueries({ queryKey: ["blog_categories"] });
    },
  });
};

export const useGetBlogsForAdmin = (params: GetParams) =>
  useQuery<IResponse<IBlogPost>>({
    queryKey: ["admin_blogs", params],
    queryFn: async () => (await api.get("/blog/admin/posts", { params })).data,
  });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) =>
      (await api.post("/blog/posts", payload)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_blogs"] }),
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) =>
      (await api.patch(`/blog/posts/${id}`, payload)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_blogs"] }),
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/blog/posts/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_blogs"] }),
  });
};
