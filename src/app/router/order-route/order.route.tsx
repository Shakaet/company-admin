// import { lazy } from "react";
// import { Navigate } from "react-router-dom";

// const CancelOrderPage = lazy(
//   () => import("@/app/pages/order/cancel-order/cancel-order-page"),
// );
// const DeliveredOrderPage = lazy(
//   () => import("@/app/pages/order/delivered-order/delivered-order-page"),
// );
// const OrderDeatilsPage = lazy(
//   () => import("@/app/pages/order/order-deatils/order-deatils-page"),
// );
// const PendingOrderPage = lazy(
//   () => import("@/app/pages/order/pending-order/pending-order-page"),
// );
// const ProcessingOrderPage = lazy(
//   () => import("@/app/pages/order/processing-order/processing-order-page"),
// );
// const ReturnOrderPage = lazy(
//   () => import("@/app/pages/order/return-order/return-order-page"),
// );
// const ShippedOrderPage = lazy(
//   () => import("@/app/pages/order/shipped-order/shipped-order-page"),
// );

// const OrderRoute = [
//   {
//     path: "order",
//     children: [
//       {
//         index: true,
//         element: <Navigate to="/dashboard" replace />,
//       },
//       {
//         path: "pending-order",
//         element: <PendingOrderPage />,
//         handle: { title: "Pending Order List" },
//       },
//       {
//         path: "processing-order",
//         element: <ProcessingOrderPage />,
//         handle: { title: "Processing Order List" },
//       },
//       {
//         path: "shipped-order",
//         element: <ShippedOrderPage />,
//         handle: { title: "Shipped Order List" },
//       },
//       {
//         path: "delivered-order",
//         element: <DeliveredOrderPage />,
//         handle: { title: "Delivered Order List" },
//       },
//       {
//         path: "cancel-order",
//         element: <CancelOrderPage />,
//         handle: { title: "Cancel Order List" },
//       },
//       {
//         path: "return-order",
//         element: <ReturnOrderPage />,
//         handle: { title: "Return Order List" },
//       },
//       {
//         path: "order-details/:id",
//         element: <OrderDeatilsPage />,
//         handle: { title: "Order Details" },
//       },
//     ],
//   },
// ];

// export default OrderRoute;
