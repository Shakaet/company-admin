import { useSiteSetting } from "@/api/setting/setting.api";
import { useEffect } from "react";
import { Outlet, useMatches, type UIMatch } from "react-router-dom";

type RouteHandle = {
  title?: string;
};

const DEFAULT_TITLE = "Company Admin";

const Title = () => {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];

  useEffect(() => {
    const lastMatch = [...matches]
      .reverse()
      .find((match) => match.handle?.title);

    document.title = lastMatch?.handle?.title || DEFAULT_TITLE;
  }, [matches]);

  return null;
};

const RootLayout = () => {
  const { data } = useSiteSetting();
  const siteSettings = data?.data as { favicon?: string } | undefined;
  useEffect(() => {
    if (!siteSettings?.favicon) return;

    let link = document.querySelector(
      "link[rel~='icon']",
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link") as HTMLLinkElement;
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = siteSettings.favicon;
  }, [siteSettings]);
  return (
    <>
      <Title />
      <Outlet />
    </>
  );
};

export default RootLayout;
