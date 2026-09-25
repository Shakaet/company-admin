export const hasAdminPermission = (
  permission: string[],
  required: string | string[],
) => {
  if (!required) return true;
  if (Array.isArray(required)) {
    return required.some((r) => permission.includes(r));
  }
  return permission?.includes(required);
};
