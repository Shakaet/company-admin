import { useLocation } from "react-router-dom";

export const useBreadcrumbs = () => {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href,
      isLast: index === segments.length - 1,
    };
  });
};
