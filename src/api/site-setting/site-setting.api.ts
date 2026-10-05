import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";
import type { ISingleResponse } from "@/interface/common-interface";

// ─── Interface ────────────────────────────────────────────────────────────────
export interface ISocialLink {
  platform: "facebook" | "twitter" | "linkedin" | "whatsapp" | "instagram" | "youtube";
  url: string;
  isActive: boolean;
}

export interface ISiteSetting {
  _id?: string;
  companyName: string;
  tagline?: string;
  logo?: string;
  logo_key?: string;
  favicon?: string;
  favicon_key?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address?: string;
  socialLinks: ISocialLink[];
  footerTagline?: string;
  footerQuickLinks?: { label: string; href: string }[];
  copyrightText?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// ─── Admin GET ────────────────────────────────────────────────────────────────
export const useGetSiteSettingAdmin = () =>
  useQuery<ISingleResponse<ISiteSetting>>({
    queryKey: ["site_setting_admin"],
    queryFn: async () => (await api.get("/site-setting/admin")).data,
  });

// ─── Admin POST (upsert, with optional logo FormData) ────────────────────────
export const useUpsertSiteSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) =>
      (await api.post("/site-setting", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_setting_admin"] }),
  });
};
