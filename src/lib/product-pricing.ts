type NumericLike = number | string | null | undefined;

type OfferDiscountType = "fixed" | "percent";

type ProductOfferLine = {
  offer_product_id?: string | number | null;
  offer_discount_price?: NumericLike;
  offer_discount_type?: OfferDiscountType | string | null;
};

type ProductOffer = {
  offer_products?: ProductOfferLine[] | null;
};

type ProductVariation = {
  _id?: string;
  variation_name?: string;
  variation_price?: NumericLike;
  variation_discount_price?: NumericLike;
  variation_whole_sale_quantity?: NumericLike;
  variation_whole_sale_price?: NumericLike;
};

export type ProductPricingInput = {
  _id?: string | number;
  id?: string | number;
  is_variation?: boolean;
  product_price?: NumericLike;
  product_discount_price?: NumericLike;
  whole_sale_quantity?: NumericLike;
  whole_sale_price?: NumericLike;
  variations?: ProductVariation[] | null;
  product_offer_id?: ProductOffer | null;
};

export type ProductDisplayPrice = {
  price: number;
  originalPrice: number | null;
  discountType: "offer" | "normal";
};

export type ProductDisplayVariationPrice = ProductDisplayPrice & {
  variationId: string | null;
  variationName: string | null;
};

type PricingMode = "single" | "all";

const toNumber = (value: NumericLike): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

const normalizePrice = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
};

const getOfferLine = (
  product: ProductPricingInput,
): ProductOfferLine | null => {
  const offerProducts = product.product_offer_id?.offer_products;
  if (!offerProducts?.length) return null;

  const productId = String(product._id ?? product.id ?? "");
  if (!productId) return null;

  const matchedLine = offerProducts.find(
    (line) => String(line.offer_product_id ?? "") === productId,
  );

  return matchedLine ?? null;
};

const checkWholesaleEligibility = (
  wholesaleQuantity: NumericLike,
  wholesalePrice: NumericLike,
  requestedQuantity: number | null,
): boolean => {
  const wsQty = toNumber(wholesaleQuantity);
  const wsPrice = toNumber(wholesalePrice);

  if (wsQty === null || wsQty <= 0) return false;
  if (wsPrice === null || wsPrice <= 0) return false;
  if (requestedQuantity === null || requestedQuantity < wsQty) return false;

  return true;
};

const applyOfferDiscount = (
  basePrice: number,
  offerLine: ProductOfferLine | null,
): number | null => {
  if (!offerLine) return null;

  const discountValue = toNumber(offerLine.offer_discount_price);
  if (discountValue === null || discountValue <= 0) return null;

  const offerType = offerLine.offer_discount_type;
  if (offerType === "fixed") {
    return normalizePrice(basePrice - discountValue);
  }

  if (offerType === "percent") {
    return normalizePrice(basePrice - (basePrice * discountValue) / 100);
  }

  return null;
};

const buildPriceResult = (
  basePrice: number,
  fallbackDiscountPrice: number | null,
  offerLine: ProductOfferLine | null,
): ProductDisplayPrice => {
  const offerPrice = applyOfferDiscount(basePrice, offerLine);
  if (offerPrice !== null && offerPrice < basePrice) {
    return {
      price: offerPrice,
      originalPrice: basePrice,
      discountType: "offer",
    };
  }

  if (fallbackDiscountPrice !== null && fallbackDiscountPrice < basePrice) {
    return {
      price: normalizePrice(fallbackDiscountPrice),
      originalPrice: basePrice,
      discountType: "normal",
    };
  }

  return {
    price: normalizePrice(basePrice),
    originalPrice: null,
    discountType: "normal",
  };
};

export function calculateProductDisplayPrice(
  product: ProductPricingInput,
  mode: "single",
  requestedQuantity?: number | null,
): ProductDisplayPrice;

export function calculateProductDisplayPrice(
  product: ProductPricingInput,
  mode: "all",
  requestedQuantity?: number | null,
): ProductDisplayVariationPrice[];

export function calculateProductDisplayPrice(
  product: ProductPricingInput,
  mode: PricingMode = "single",
  requestedQuantity: number | null = null,
): ProductDisplayPrice | ProductDisplayVariationPrice[] {
  const offerLine = getOfferLine(product);
  const isVariationProduct = Boolean(product.is_variation);

  if (isVariationProduct) {
    const variations = product.variations ?? [];

    if (mode === "all") {
      return variations.map((variation) => {
        const isWholesaleEligible = checkWholesaleEligibility(
          variation.variation_whole_sale_quantity,
          variation.variation_whole_sale_price,
          requestedQuantity,
        );

        if (isWholesaleEligible) {
          const wholesalePrice = normalizePrice(
            toNumber(variation.variation_whole_sale_price) ?? 0,
          );

          return {
            price: wholesalePrice,
            originalPrice: null,
            discountType: "normal",
            variationId: variation._id ?? null,
            variationName: variation.variation_name ?? null,
          };
        }

        const basePrice = toNumber(variation.variation_price) ?? 0;
        const variationDiscountPrice = toNumber(
          variation.variation_discount_price,
        );
        const priceResult = buildPriceResult(
          basePrice,
          variationDiscountPrice,
          offerLine,
        );

        return {
          ...priceResult,
          variationId: variation._id ?? null,
          variationName: variation.variation_name ?? null,
        };
      });
    }

    const firstVariation = variations[0];

    const isWholesaleEligible = checkWholesaleEligibility(
      firstVariation?.variation_whole_sale_quantity,
      firstVariation?.variation_whole_sale_price,
      requestedQuantity,
    );

    if (isWholesaleEligible) {
      const wholesalePrice = normalizePrice(
        toNumber(firstVariation?.variation_whole_sale_price) ?? 0,
      );

      return {
        price: wholesalePrice,
        originalPrice: null,
        discountType: "normal",
      };
    }

    const basePrice = toNumber(firstVariation?.variation_price) ?? 0;
    const variationDiscountPrice = toNumber(
      firstVariation?.variation_discount_price,
    );

    return buildPriceResult(basePrice, variationDiscountPrice, offerLine);
  }

  const isWholesaleEligible = checkWholesaleEligibility(
    product.whole_sale_quantity,
    product.whole_sale_price,
    requestedQuantity,
  );

  if (isWholesaleEligible) {
    const wholesalePrice = normalizePrice(
      toNumber(product.whole_sale_price) ?? 0,
    );

    if (mode === "all") {
      return [
        {
          price: wholesalePrice,
          originalPrice: null,
          discountType: "normal",
          variationId: null,
          variationName: null,
        },
      ];
    }

    return {
      price: wholesalePrice,
      originalPrice: null,
      discountType: "normal",
    };
  }

  const basePrice = toNumber(product.product_price) ?? 0;
  const productDiscountPrice = toNumber(product.product_discount_price);
  const priceResult = buildPriceResult(
    basePrice,
    productDiscountPrice,
    offerLine,
  );

  if (mode === "all") {
    return [
      {
        ...priceResult,
        variationId: null,
        variationName: null,
      },
    ];
  }

  return priceResult;
}
