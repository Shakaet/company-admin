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

  // ! Banner Management
  {
    Name: "Banner Management",
    Type: [
      {
        type_name: "View Banner",
        type_value: "banner_show",
        description: "View banner list and details",
      },
      {
        type_name: "Create Banner",
        type_value: "banner_create",
        description: "Create new banner for website",
      },
      {
        type_name: "Update Banner",
        type_value: "banner_update",
        description: "Update existing banner details",
      },
      {
        type_name: "Delete Banner",
        type_value: "banner_delete",
        description: "Delete banner from website",
      },
    ],
  },

  // ! Contact Management
  {
    Name: "Contact Management",
    Type: [
      {
        type_name: "View Contact",
        type_value: "contact_show",
        description: "View contact messages",
      },
      {
        type_name: "Delete Contact",
        type_value: "contact_delete",
        description: "Delete contact messages",
      },
    ],
  },

  // ! Career Management
  {
    Name: "Career Management",
    Type: [
      {
        type_name: "View Career",
        type_value: "career_show",
        description: "View job posts and applications",
      },
      {
        type_name: "Create Career",
        type_value: "career_create",
        description: "Create new job posts",
      },
      {
        type_name: "Update Career",
        type_value: "career_update",
        description: "Update job posts",
      },
      {
        type_name: "Delete Career",
        type_value: "career_delete",
        description: "Delete job posts",
      },
    ],
  },

  // ! Pricing Management
  {
    Name: "Pricing Management",
    Type: [
      {
        type_name: "View Pricing",
        type_value: "pricing_show",
        description: "View pricing plans",
      },
      {
        type_name: "Create Pricing",
        type_value: "pricing_create",
        description: "Create new pricing plans",
      },
      {
        type_name: "Update Pricing",
        type_value: "pricing_update",
        description: "Update pricing plans",
      },
      {
        type_name: "Delete Pricing",
        type_value: "pricing_delete",
        description: "Delete pricing plans",
      },
    ],
  },

  // ! Portfolio Management
  {
    Name: "Portfolio Management",
    Type: [
      {
        type_name: "View Portfolio",
        type_value: "portfolio_show",
        description: "View portfolio projects",
      },
      {
        type_name: "Create Portfolio",
        type_value: "portfolio_create",
        description: "Create new portfolio projects",
      },
      {
        type_name: "Update Portfolio",
        type_value: "portfolio_update",
        description: "Update portfolio projects",
      },
      {
        type_name: "Delete Portfolio",
        type_value: "portfolio_delete",
        description: "Delete portfolio projects",
      },
    ],
  },

  // ! Service Management
  {
    Name: "Service Management",
    Type: [
      {
        type_name: "View Service",
        type_value: "service_show",
        description: "View services",
      },
      {
        type_name: "Create Service",
        type_value: "service_create",
        description: "Create new services",
      },
      {
        type_name: "Update Service",
        type_value: "service_update",
        description: "Update services",
      },
      {
        type_name: "Delete Service",
        type_value: "service_delete",
        description: "Delete services",
      },
    ],
  },

  // ! About Management
  {
    Name: "About Management",
    Type: [
      {
        type_name: "View About",
        type_value: "about_show",
        description: "View about page data",
      },
      {
        type_name: "Update About",
        type_value: "about_create",
        description: "Update about page data",
      },
    ],
  },

  // ! Home Elements Management
  {
    Name: "Home Elements Management",
    Type: [
      {
        type_name: "View Home Elements",
        type_value: "home_show",
        description: "View home page dynamic elements",
      },
      {
        type_name: "Create Home Elements",
        type_value: "home_create",
        description: "Create new home page dynamic elements",
      },
      {
        type_name: "Update Home Elements",
        type_value: "home_update",
        description: "Update home page dynamic elements",
      },
      {
        type_name: "Delete Home Elements",
        type_value: "home_delete",
        description: "Delete home page dynamic elements",
      },
    ],
  },
];

export default PermissionData;
