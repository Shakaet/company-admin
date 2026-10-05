import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminPermission } from "@/helper/use-admin-permission";
import Header from "@/components/custom/header";
import { Settings, Share2 } from "lucide-react";
import GeneralSettingTab from "./tabs/general-setting-tab";
import SocialLinksTab from "./tabs/social-links-tab";

export default function SiteSettingPage() {
  const { can } = useAdminPermission();

  if (!can("site_setting_show")) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground text-lg">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Site Settings"
        description="Manage company info, contact details, social links and footer content"
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto flex-nowrap rounded-lg border border-border">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 py-2 px-4 rounded-md"
          >
            <Settings className="w-4 h-4" />
            <span className="whitespace-nowrap">General & Footer</span>
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="flex items-center gap-2 py-2 px-4 rounded-md"
          >
            <Share2 className="w-4 h-4" />
            <span className="whitespace-nowrap">Social Links</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general" className="m-0 border-none p-0 outline-none">
            <GeneralSettingTab />
          </TabsContent>
          <TabsContent value="social" className="m-0 border-none p-0 outline-none">
            <SocialLinksTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
