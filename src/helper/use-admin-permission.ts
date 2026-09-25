import { useAuth } from "@/context/auth-context";
import { hasAdminPermission } from "./has-admin-permission";

type Permission = string;

export const useAdminPermission = () => {
  const { admin } = useAuth();

  const permissions: Permission[] = admin?.admin_role_id?.permissions || [];

  const can = (required: Permission | Permission[]) => {
    return hasAdminPermission(permissions, required);
  };

  return {
    permissions,
    can,
  };
};
