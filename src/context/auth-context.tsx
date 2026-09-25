import api from "@/api/base-api/base.api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Permission = string;

export interface AdminRole {
  permissions: Permission[];
}

export interface Admin {
  _id?: string;
  admin_phone?: string;
  admin_role_id?: AdminRole;
  [key: string]: any;
}

interface AuthContextType {
  loginAdmin: (payload: any) => Promise<void>;
  admin: Admin | null;
  adminRole: string | null;
  adminPermissions: Permission[];
  isAdminAuthenticated: boolean;
  adminLoading: boolean;
  adminLogout: () => Promise<void>;
  refreshAdmin: (url?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<Permission[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const setAdminState = (data: Admin | null) => {
    setAdmin(data);
    setAdminRole(data?.admin_phone ? "admin" : null);
    setAdminPermissions(
      data?.admin_role_id?.permissions ? data.admin_role_id.permissions : [],
    );
    setIsAdminAuthenticated(!!data);
  };

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await api.get("/admin");
        const data: Admin = res?.data?.data;
        setAdminState(data);
      } catch (err) {
        setAdminState(null);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const refreshAdmin = async (url = "/admin") => {
    const res = await api.get(url);
    const data: Admin = res?.data?.data;
    setAdminState(data);
  };

  // const loginAdmin = async (payload: any) => {
  //   await api.post("/admin_reg_log/login", payload);
  //   await refreshAdmin();
  // };

  const loginAdmin = async (payload: any) => {
    const res = await api.post("/admin/login", payload);

    if (!res?.data?.success) {
      throw new Error(res?.data?.message || "Login failed");
    }

    await refreshAdmin();
  };
  const adminLogout = async () => {
    await api.get("/admin/logout");
    setAdminState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loginAdmin,
        admin,
        adminRole,
        adminPermissions,
        isAdminAuthenticated,
        adminLoading,
        adminLogout,
        refreshAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
