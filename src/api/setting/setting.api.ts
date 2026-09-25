import type { GetParams, IResponse } from "@/interface/common-interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../base-api/base.api";

export interface ISettingInterface {
  _id?: any;
  logo?: string;
  pay_with?: string;
  favicon?: string;
  title?: string;
  contact?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  you_tube?: string;
  watsapp?: string;
  tik_tok?: string;
  about_us?: string;
  privacy_policy?: string;
  refund_policy?: string;
  cancellation_policy?: string;
  terms_condition?: string;
  card_one_logo?: string;
  card_one_title?: string;
  card_two_logo?: string;
  card_two_title?: string;
  card_three_logo?: string;
  card_three_title?: string;
  card_four_logo?: string;
  card_four_title?: string;
  card_five_logo?: string;
  card_five_title?: string;

  //  banner card bg image and button path
  card_one_banner?: string;
  card_one_path?: string;
  card_two_banner?: string;
  card_two_path?: string;
  card_three_banner?: string;
  card_three_path?: string;

  // laundry service
  laundry_service_image?: string;
  laundry_service_note?: string;

  // delivery
  is_shipping_charge_off?: boolean;
  inside_dhaka_delivery_charge?: number;
  inside_dhaka_delivery_days?: string;
  outside_dhaka_delivery_charge?: number;
  outside_dhaka_delivery_days?: string;
}

// ! GET ALL BANNERS
const getSettingApi = async (
  params: GetParams = {},
): Promise<IResponse<ISettingInterface>> => {
  const response = await api.get<IResponse<ISettingInterface>>(
    "/setting/admin",
    {
      params,
    },
  );
  return response.data;
};

export const useGetSetting = () => {
  return useQuery({
    queryKey: ["setting"],
    queryFn: () => getSettingApi(),
  });
};

// ! get public setting
const getPublicSettingApi = async (
  params: GetParams = {},
): Promise<IResponse<any[]>> => {
  const response = await api.get<IResponse<any[]>>("/setting", {
    params,
  });
  return response.data;
};

export const useSiteSetting = () => {
  return useQuery({
    queryKey: ["setting"],
    queryFn: () => getPublicSettingApi(),
  });
};

// ! UPDATE Setting (id in request body)
const updateSettingApi = async (payload: FormData) => {
  const response = await api.post("/setting/admin", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["setting"],
    mutationFn: (payload: FormData) => updateSettingApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting"] });
    },
  });
};
