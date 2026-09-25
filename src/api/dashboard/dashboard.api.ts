import { useQuery } from "@tanstack/react-query";
import api from "../base-api/base.api";

export interface IDashboardSummary {
  total_offer: number;
  total_product: number;
  _id: string | null;
  total_order: number;
  pending_order: number;
  processing_order: number;
  shipped_order: number;
  delivered_order: number;
  cancel_order: number;
  return_order: number;
  today_order: number;
  weekly_order: number;
  monthly_order: number;
  total_revenue: number;
  delivered_revenue: number;
}

export interface IDashboardData {
  admin: IDashboardSummary;
  merchant: IDashboardSummary;
}

export interface IDashboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IDashboardData;
}

export interface IDashboardParams {
  startDate?: string;
  endDate?: string;
}

const getDashboardApi = async (
  params?: IDashboardParams,
): Promise<IDashboardResponse> => {
  const queryParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => value),
  );

  const { data } = await api.get<IDashboardResponse>("/dashboard", {
    params: queryParams,
  });

  return data;
};

export const useGetDashboard = (params?: IDashboardParams, enabled = true) => {
  return useQuery({
    queryKey: ["dashboard", params],
    queryFn: () => getDashboardApi(params),
    enabled,
  });
};
