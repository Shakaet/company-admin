export function isRouteActive(pathname: string, item: any) {
  // ! Single menu (exact match only)
  if (item.url) {
    return pathname === item.url;
  }

  // ! Nested menu (any child exact match)
  if (item.items?.length) {
    return item.items.some((sub: any) => pathname === sub.url);
  }

  return false;
}
