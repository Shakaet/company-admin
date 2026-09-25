// import { lazy } from "react";

// const MerchantOfferPage = lazy(
//   () => import("@/app/pages/merchant-offer/merchant-offer-page"),
// );
// const AddOfferPage = lazy(
//   () => import("@/app/pages/product-management/add-offer/add-offer-page"),
// );
// const SelfOfferPage = lazy(
//   () => import("@/app/pages/self-offer/self-offer-page"),
// );

// import { Navigate } from "react-router-dom";

// const OfferRoute = [
//   {
//     path: "offer",
//     children: [
//       {
//         index: true,
//         element: <Navigate to="/dashboard" replace />,
//       },
//       {
//         path: "merchant",
//         element: <MerchantOfferPage />,
//         handle: { title: "Merchant" },
//       },
//       {
//         path: "self",
//         element: <SelfOfferPage />,
//         handle: { title: "Self" },
//       },
//       {
//         path: "add",
//         element: <AddOfferPage />,
//         handle: { title: "Add" },
//       },
//     ],
//   },
// ];

// export default OfferRoute;
