const PermissionData = [
  // ! Dashboard permission data
  {
    Name: "Dashboard Permission",
    Type: [
      {
        type_name: "Dashboard Show",
        type_value: "admin_dashboard_show",
        description: "Access dashboard overview and statistics",
      },
    ],
  },

  // ! Commission permission data
  {
    Name: "Commission Permission",
    Type: [
      {
        type_name: "Commission Table Show",
        type_value: "admin_commission_show",
        description: "Access commission details and reports",
      },
    ],
  },

  // ! Role Management
  {
    Name: "Role Management",
    Type: [
      {
        type_name: "View Role",
        type_value: "admin_role_show",
        description: "View roles and their permissions",
      },
      {
        type_name: "Create Role",
        type_value: "admin_role_create",
        description: "Create new admin roles",
      },
      {
        type_name: "Update Role",
        type_value: "admin_role_update",
        description: "Update existing admin roles",
      },
      {
        type_name: "Delete Role",
        type_value: "admin_role_delete",
        description: "Delete admin roles",
      },
    ],
  },
  // ! Admin Management
  {
    Name: "Admin Management",
    Type: [
      {
        type_name: "View Admin",
        type_value: "admin_show",
        description: "View admin list and details",
      },
      {
        type_name: "Create Admin",
        type_value: "admin_create",
        description: "Create new admin for website",
      },
      {
        type_name: "Update Admin",
        type_value: "admin_update",
        description: "Update existing admin details",
      },
      {
        type_name: "Delete Admin",
        type_value: "admin_delete",
        description: "Delete admin from website",
      },
    ],
  },
  // ! Rider Management
  {
    Name: "Rider Management",
    Type: [
      {
        type_name: "View Rider",
        type_value: "rider_show",
        description: "View Rider list and details",
      },
      {
        type_name: "Update Rider",
        type_value: "rider_update",
        description: "Update existing Rider details",
      },
    ],
  },

  // ! Merchant Management
  {
    Name: "Merchant Management",
    Type: [
      {
        type_name: "View All Merchant",
        type_value: "admin_merchant_show",
        description: "View all merchant list and details",
      },
      {
        type_name: "View Apply Merchant",
        type_value: "admin_merchant_apply_show",
        description: "View apply merchant list and details",
      },

      {
        type_name: "Update Merchant Apply",
        type_value: "admin_merchant_update",
        description: "Update existing Apply merchant details",
      },
    ],
  },

  // ! supplier Management
  {
    Name: "Supplier Management",
    Type: [
      {
        type_name: "View Supplier",
        type_value: "admin_supplier_show",
        description: "View  supplier list and details",
      },
      {
        type_name: "Create Supplier",
        type_value: "admin_supplier_create",
        description: "Create new supplier for products",
      },
      {
        type_name: "Update Supplier",
        type_value: "admin_supplier_update",
        description: "Update existing supplier details",
      },
      {
        type_name: "Delete Supplier",
        type_value: "admin_supplier_delete",
        description: "Delete supplier ",
      },
      {
        type_name: "Supplier Payment Show",
        type_value: "admin_supplier_payment_show",
        description: "View supplier payment details",
      },
      {
        type_name: "Supplier Payment Create",
        type_value: "admin_supplier_payment_create",
        description: "Create new supplier payment",
      },
    ],
  },

  // ! Customer
  {
    Name: "Customer Management",
    Type: [
      {
        type_name: "View Customer",
        type_value: "admin_customer_show",
        description: "View customer list and details",
      },

      {
        type_name: "Update Customer",
        type_value: "admin_customer_update",
        description: "Update existing customer status",
      },
      {
        type_name: "Customer Payment Show",
        type_value: "admin_customer_payment_show",
        description: "View customer payment details",
      },
      {
        type_name: "Customer Payment Create",
        type_value: "admin_customer_payment_create",
        description: "Create new customer payment",
      },
    ],
  },

  // ! Banner Management
  {
    Name: "Banner Management",
    Type: [
      {
        type_name: "View Banner",
        type_value: "admin_banner_show",
        description: "View banner list and details",
      },
      {
        type_name: "Create Banner",
        type_value: "admin_banner_create",
        description: "Create new banner for website",
      },
      {
        type_name: "Update Banner",
        type_value: "admin_banner_update",
        description: "Update existing banner details",
      },
      {
        type_name: "Delete Banner",
        type_value: "admin_banner_delete",
        description: "Delete banner from website",
      },
    ],
  },

  // ! Category Management
  {
    Name: "Category Management",
    Type: [
      {
        type_name: "View Category",
        type_value: "admin_category_show",
        description: "View  category list and details",
      },
      {
        type_name: "Create Category",
        type_value: "admin_category_create",
        description: "Create new category for products",
      },
      {
        type_name: "Update Category",
        type_value: "admin_category_update",
        description: "Update existing category details",
      },
      {
        type_name: "Delete Category",
        type_value: "admin_category_delete",
        description: "Delete category from product management",
      },
    ],
  },

  // ! Attribute Management
  {
    Name: "Attribute Management",
    Type: [
      {
        type_name: "View Attribute",
        type_value: "admin_attribute_show",
        description: "View  attribute list and details",
      },
      {
        type_name: "Create Attribute",
        type_value: "admin_attribute_create",
        description: "Create new attribute for products",
      },
      {
        type_name: "Update Attribute",
        type_value: "admin_attribute_update",
        description: "Update existing attribute details",
      },
      {
        type_name: "Delete Attribute",
        type_value: "admin_attribute_delete",
        description: "Delete attribute from product management",
      },
    ],
  },

  // ! product management
  {
    Name: "Product Management",
    Type: [
      {
        type_name: "View Product",
        type_value: "admin_product_show",
        description: "View  product list and details",
      },
      {
        type_name: "Create Product",
        type_value: "admin_product_create",
        description: "Create new product for website",
      },
      {
        type_name: "Update Product",
        type_value: "admin_product_update",
        description: "Update existing product details",
      },
      {
        type_name: "Delete Product",
        type_value: "admin_product_delete",
        description: "Delete product from website",
      },
    ],
  },

  // ! Purchase Management
  {
    Name: "Purchase Management",
    Type: [
      {
        type_name: "View Purchase",
        type_value: "admin_purchase_show",
        description: "View purchase list and details",
      },
      {
        type_name: "Add Purchase",
        type_value: "admin_purchase_create",
        description: "Create new purchase for website",
      },

      {
        type_name: "Purchase Return Create",
        type_value: "admin_purchase_return_create",
        description: "Create new purchase return for website",
      },
      {
        type_name: "Purchase Update Show",
        type_value: "admin_purchase_return_show",
        description: "View existing purchase details",
      },
    ],
  },

  // ! pos Management
  {
    Name: "POS Management",
    Type: [
      {
        type_name: "View POS Order",
        type_value: "admin_pos_order_show",
        description: "View POS order list and details",
      },
      {
        type_name: "Create POS Order",
        type_value: "admin_pos_order_create",
        description: "Create new POS order for website",
      },
      {
        type_name: "Update POS Order",
        type_value: "admin_pos_order_update",
        description: "Update existing POS order details",
      },
      {
        type_name: "Delete POS Order",
        type_value: "admin_pos_order_delete",
        description: "Delete POS order from management",
      },
    ],
  },

  // ! POS return Management
  {
    Name: "POS Return Management",
    Type: [
      {
        type_name: "View POS Return Order",
        type_value: "admin_pos_return_show",
        description: "View POS return order list and details",
      },
      {
        type_name: "Create POS Return Order",
        type_value: "admin_pos_return_create",
        description: "Create new POS return order for website",
      },
    ],
  },

  // ! site setting
  {
    Name: "Site Setting",
    Type: [
      {
        type_name: "View Setting",
        type_value: "admin_setting_show",
        description: "View  Setting list and details",
      },

      {
        type_name: "Create and Update Setting",
        type_value: "admin_setting_create_update",
        description: "Create and Update existing product details",
      },
    ],
  },

  // ! Offer Management
  {
    Name: "Offer Management",
    Type: [
      {
        type_name: "View Offer",
        type_value: "offer_show",
        description: "View  Offer list and details",
      },
      {
        type_name: "Create Offer",
        type_value: "offer_create",
        description: "Create new offer for products",
      },
      {
        type_name: "Update Offer",
        type_value: "offer_update",
        description: "Update existing offer details",
      },
      {
        type_name: "Delete Offer",
        type_value: "offer_delete",
        description: "Delete offer ",
      },
    ],
  },

  // ! Coupon Management
  {
    Name: "Coupon Management",
    Type: [
      {
        type_name: "View Coupon",
        type_value: "admin_coupon_show",
        description: "View  Coupon list and details",
      },
      {
        type_name: "Create Coupon",
        type_value: "admin_coupon_create",
        description: "Create new coupon for products",
      },
      {
        type_name: "Update Coupon",
        type_value: "admin_coupon_update",
        description: "Update existing coupon details",
      },
      {
        type_name: "Delete Coupon",
        type_value: "admin_coupon_delete",
        description: "Delete coupon ",
      },
    ],
  },

  // ! Laundry Service Management
  {
    Name: "Laundry Service Management",
    Type: [
      {
        type_name: "View Laundry Service",
        type_value: "admin_laundry_service_show",
        description: "View  Laundry Service list and details",
      },
      {
        type_name: "Update Laundry Service",
        type_value: "admin_laundry_service_update",
        description: "Update existing Laundry Service details",
      },
      {
        type_name: "Delete Laundry Service",
        type_value: "admin_laundry_service_delete",
        description: "Delete Laundry Service from management",
      },
    ],
  },

  // ! Custom Order Management
  {
    Name: "Custom Order Management",
    Type: [
      {
        type_name: "View Custom Order",
        type_value: "admin_custom_order_show",
        description: "View  Custom Order list and details",
      },
      {
        type_name: "Update Custom Order",
        type_value: "admin_custom_order_update",
        description: "Update existing Custom Order details",
      },
      {
        type_name: "Delete Custom Order",
        type_value: "admin_custom_order_delete",
        description: "Delete Custom Order from management",
      },
    ],
  },

  // ! Custom Medicine Order Management
  {
    Name: "Custom Medicine Order Management",
    Type: [
      {
        type_name: "View Custom Medicine Order",
        type_value: "admin_custom_medicine_order_show",
        description: "View  Custom Medicine Order list and details",
      },
      {
        type_name: "Update Custom Medicine Order",
        type_value: "admin_custom_medicine_order_update",
        description: "Update existing Custom Medicine Order details",
      },
      {
        type_name: "Delete Custom Medicine Order",
        type_value: "admin_custom_medicine_order_delete",
        description: "Delete Custom Medicine Order from management",
      },
    ],
  },

  // ! Payment Method Management
  {
    Name: "Payment Method",
    Type: [
      {
        type_name: "View Payment Method",
        type_value: "admin_payment_method_show",
        description: "View method list and details",
      },
      {
        type_name: "Create Payment Method",
        type_value: "admin_payment_method_create",
        description: "Create new methiod",
      },
      {
        type_name: "Update Payment Method",
        type_value: "admin_payment_method_update",
        description: "Update existing method",
      },
      {
        type_name: "Delete Payment Method",
        type_value: "admin_payment_method_delete",
        description: "Delete methods",
      },
    ],
  },

  // ! Rider Withdraw Management

  {
    Name: "Rider Withdraw Management",
    Type: [
      {
        type_name: "View Rider Withdraw",
        type_value: "admin_rider_withdraw_show",
        description: "View rider withdraw list and details",
      },
      {
        type_name: "Create Rider Withdraw",
        type_value: "admin_rider_withdraw_create",
        description: "Create new rider withdraw request",
      },
      {
        type_name: "Update Rider Withdraw",
        type_value: "admin_rider_withdraw_update",
        description: "Update existing rider withdraw request",
      },
      {
        type_name: "Delete Rider Withdraw",
        type_value: "admin_rider_withdraw_delete",
        description: "Delete rider withdraw request",
      },
    ],
  },

  // ! Merchant Withdraw Management

  {
    Name: "Merchant Withdraw Management",
    Type: [
      {
        type_name: "View Merchant Withdraw",
        type_value: "admin_merchant_withdraw_deposite_show",
        description: "View merchant withdraw list and details",
      },

      {
        type_name: "Update Merchant Withdraw",
        type_value: "admin_merchant_withdraw_deposite_update",
        description: "Update existing merchant withdraw request",
      },
      {
        type_name: "Delete Merchant Withdraw",
        type_value: "admin_merchant_withdraw_deposite_delete",
        description: "Delete merchant withdraw request",
      },
    ],
  },

  // ! Expense Category Management
  {
    Name: "Expense Category",
    Type: [
      {
        type_name: "View Expense Category",
        type_value: "admin_expense_category_show",
        description: "View expense category list and details",
      },
      {
        type_name: "Create Expense Category",
        type_value: "admin_expense_category_create",
        description: "Create new expense category",
      },
      {
        type_name: "Update Expense Category",
        type_value: "admin_expense_category_update",
        description: "Update existing expense category",
      },
      {
        type_name: "Delete Expense Category",
        type_value: "admin_expense_category_delete",
        description: "Delete expense category",
      },
    ],
  },

  // ! Expense Management
  {
    Name: "Expense Management",
    Type: [
      {
        type_name: "View Expense ",
        type_value: "admin_expense_show",
        description: "View expense list and details",
      },
      {
        type_name: "Create Expense",
        type_value: "admin_expense_create",
        description: "Create new expense",
      },
    ],
  },

  // ! Order Management
  {
    Name: "Order Management",
    Type: [
      {
        type_name: "View Order",
        type_value: "admin_order_show",
        description: "View order list and details",
      },
      {
        type_name: "Update Order",
        type_value: "admin_order_update",
        description: "Update order details",
      },
    ],
  },

  // ! Refund Management
  {
    Name: "Refund Management",
    Type: [
      {
        type_name: "View Refund",
        type_value: "admin_refund_show",
        description: "View refund list and details",
      },

      {
        type_name: "Update Refund",
        type_value: "admin_refund_update",
        description: "update refund status",
      },
    ],
  },
];

export default PermissionData;
