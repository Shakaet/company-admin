import type { Status } from "@/interface/common-interface";

export interface IVariationForm {
  variation_name: string;
  variation_values: {
    attribute_name: string;
    attribute_value: string;
  }[];
  variation_price: number | null;
  variation_discount_price?: number | null;
  variation_quantity?: number | null;
  variation_buying_price?: number | null;
  variation_whole_sale_quantity: number | null;
  variation_whole_sale_price: number | null;
  variation_serial?: number;
}

export interface ISelectedAttributeForm {
  attribute_name: string;
  attribute_value: string[];
}

export interface IProductFormValues {
  product_name_en: string;
  product_name_bn: string;

  product_brand?: string;
  product_status: Status;
  category_id: string;
  is_medicine_product: boolean;
  product_image: File | null;

  product_price?: number | null;
  product_discount_price?: number | null;
  product_quantity?: number | null;
  product_buying_price?: number | null;
  product_sku: string;
  whole_sale_quantity: number | null;
  whole_sale_price: number | null;

  is_variation: boolean;
  product_unit_name?: string;

  other_images: {
    other_image: File | null;
  }[];

  attributes_details: ISelectedAttributeForm[];
  variations: IVariationForm[];

  product_description_en?: string;
  product_description_bn?: string;

  trending_product: boolean;
  admin_inactive?: boolean;
  manufacturer_expire_exist?: boolean;
}

export type AddProductProps = {
  admin: any;
  categoryOptions: {
    label: string;
    value: string;
  }[];
  attribute: {
    _id: string;
    attribute_name: string;
    attribute_value: string[];
    attribute_serial?: number;
    attribute_status?: string;
  }[];
};
