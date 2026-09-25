export type Status = "active" | "in-active";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T[];
  totalData?: number;
}

export interface GetParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  user_type?: string;
  query_type?: string;
  is_medicine_product?: boolean;
  expense_category_id?: string;
  payment_method_id?: string;
  expense_product_id?: string;
  pos_product?: boolean;
  web_site_product?: boolean;
  general_expense?: boolean;
  product_expense?: boolean;
  product_owner_id?: any;
  order_owner_type?: string;
  order_status?: any;
  order_delivery_by?: any;
  return_order_status?:any,
  return_order_owner_type?:any
}
